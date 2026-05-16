package media

import (
	"context"
	"fmt"
	"mime/multipart"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/mauryashiva/invenzo-backend/common/config"
	"github.com/mauryashiva/invenzo-backend/internal/domain"
	"github.com/mauryashiva/invenzo-backend/pkg/utils"
)

type Service struct {
	repo       *Repository
	cloudinary *cloudinary.Cloudinary
}

func NewService(repo *Repository) *Service {
	cfg := config.Get()
	cld, err := cloudinary.NewFromParams(cfg.CloudinaryCloudName, cfg.CloudinaryAPIKey, cfg.CloudinaryAPISecret)
	if err != nil {
		fmt.Printf("⚠️  Cloudinary failed to initialize: %v\n", err)
	}
	return &Service{
		repo:       repo,
		cloudinary: cld,
	}
}

/**
 * 📤 UPLOAD TO CLOUD & DB
 * Handles file transfer to Cloudinary and metadata persistence in GORM.
 */
func (s *Service) Upload(ctx context.Context, file *multipart.FileHeader, path string, fileContext string) (*domain.Media, error) {
	// 1. Open multipart file
	f, err := file.Open()
	if err != nil {
		return nil, err
	}
	defer f.Close()

	// 2. Upload to Cloudinary with Auto-Detection
	boolTrue := true
	uploadResult, err := s.cloudinary.Upload.Upload(ctx, f, uploader.UploadParams{
		Folder:         path,
		PublicID:       utils.GenerateFileName(file.Filename, fileContext),
		UniqueFilename: &boolTrue,
		Overwrite:      &boolTrue,
		// ⚡ LATEST UPDATE: "auto" allows Cloudinary to handle Images and Videos automatically
		ResourceType:   "auto", 
	})
	if err != nil {
		return nil, fmt.Errorf("cloudinary upload failed: %w", err)
	}

	// 3. Prepare Domain Model
	media := &domain.Media{
		URL:       uploadResult.SecureURL,
		PublicID:  uploadResult.PublicID,
		FileType:  uploadResult.ResourceType, // Will store "image" or "video"
		MimeType:  file.Header.Get("Content-Type"),
		Size:      file.Size,
		CreatedAt: time.Now(),
	}

	// 4. Save to database via Repository
	if err := s.repo.Create(media); err != nil {
		// 🛡️ MANUAL ROLLBACK: If DB fails, delete from Cloudinary to keep storage clean
		_ = s.DeleteFromCloud(ctx, media.PublicID)
		return nil, fmt.Errorf("database persistence failed: %w", err)
	}

	return media, nil
}

/**
 * 🗑️ CLOUD-ONLY DELETE
 * Used for rollbacks or internal cleanups.
 */
func (s *Service) DeleteFromCloud(ctx context.Context, publicID string) error {
	_, err := s.cloudinary.Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID:     publicID,
		ResourceType: "auto", // Required for videos/raw files
	})
	return err
}

/**
 * 🗑️ FULL SYSTEM DELETE
 * Removes record from DB and physical file from Cloudinary.
 */
func (s *Service) DeleteMediaRecord(ctx context.Context, id string) error {
	// 1. Find record to get PublicID
	media, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	// 2. Delete from Cloudinary
	if err := s.DeleteFromCloud(ctx, media.PublicID); err != nil {
		return fmt.Errorf("failed to remove file from cloud: %w", err)
	}

	// 3. Delete from DB
	return s.repo.Delete(id)
}

/**
 * 🔗 ASSOCIATION LOGIC
 * Links previously uploaded media to a specific product or variant.
 */
func (s *Service) AssociateMedia(mediaIDs []string, associatedID string) error {
	if len(mediaIDs) == 0 {
		return nil
	}
	return s.repo.Associate(mediaIDs, associatedID)
}

/**
 * 🔍 RETRIEVAL
 */
func (s *Service) FindByID(ctx context.Context, id string) (*domain.Media, error) {
	return s.repo.FindByID(id)
}