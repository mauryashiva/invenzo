package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Media struct {
	ID           string         `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	URL          string         `gorm:"not null" json:"url"`
	PublicID     string         `gorm:"not null;index" json:"public_id"` // For Cloudinary/S3 deletion
	FileType     string         `gorm:"type:varchar(50)" json:"file_type"` // image, video, document
	MimeType     string         `gorm:"type:varchar(100)" json:"mime_type"`
	Size         int64          `json:"size"`
	AssociatedID *string        `gorm:"type:uuid;index" json:"associated_id,omitempty"` // ProductID or VariantID
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

func (m *Media) BeforeCreate(tx *gorm.DB) (err error) {
	if m.ID == "" {
		m.ID = uuid.New().String()
	}
	return
}
