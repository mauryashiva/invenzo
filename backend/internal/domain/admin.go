// internal/domain/admin.go
// Admin identity model — used by auth, middleware, and all admin modules.
package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Admin struct {
	ID           string         `gorm:"type:uuid;primaryKey" json:"id"`
	Name         string         `gorm:"not null" json:"name"`
	Email        string         `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string         `gorm:"not null" json:"-"`
	Role         string         `gorm:"default:'admin'" json:"role"` // admin | super_admin
	IsActive     bool           `gorm:"default:false" json:"is_active"` // false until invite accepted

	// Invitation flow
	InviteToken     string     `gorm:"index" json:"-"`
	InviteExpiresAt *time.Time `json:"-"`
	InvitedByID     *string    `gorm:"type:uuid" json:"invited_by_id"`

	// Password reset flow
	ResetToken     string     `gorm:"index" json:"-"`
	ResetExpiresAt *time.Time `json:"-"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}


// BeforeCreate auto-generates UUID if not set.
func (a *Admin) BeforeCreate(tx *gorm.DB) error {
	if a.ID == "" {
		a.ID = uuid.NewString()
	}
	return nil
}

type AdminRefreshToken struct {
	ID        string    `gorm:"type:uuid;primaryKey"`
	AdminID   string    `gorm:"type:uuid;index;not null"`
	Token     string    `gorm:"uniqueIndex;not null"`
	ExpiresAt time.Time `gorm:"not null"`
	CreatedAt time.Time
}

func (t *AdminRefreshToken) BeforeCreate(tx *gorm.DB) error {
	if t.ID == "" {
		t.ID = uuid.NewString()
	}
	return nil
}
