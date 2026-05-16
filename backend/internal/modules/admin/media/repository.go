package media

import (
	"github.com/mauryashiva/invenzo-backend/internal/domain"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(media *domain.Media) error {
	return r.db.Create(media).Error
}

func (r *Repository) FindByID(id string) (*domain.Media, error) {
	var media domain.Media
	if err := r.db.First(&media, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &media, nil
}

func (r *Repository) Delete(id string) error {
	return r.db.Delete(&domain.Media{}, "id = ?", id).Error
}

func (r *Repository) Associate(mediaIDs []string, associatedID string) error {
	return r.db.Model(&domain.Media{}).
		Where("id IN ?", mediaIDs).
		Update("associated_id", associatedID).Error
}

func (r *Repository) GetByAssociatedID(id string) ([]domain.Media, error) {
	var media []domain.Media
	if err := r.db.Where("associated_id = ?", id).Find(&media).Error; err != nil {
		return nil, err
	}
	return media, nil
}
