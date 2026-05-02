// internal/modules/admin/auth/repository.go
package auth

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

func (r *Repository) FindByEmail(email string) (*domain.Admin, error) {
	var admin domain.Admin
	if err := r.db.Where("email = ?", email).First(&admin).Error; err != nil {
		return nil, err
	}
	return &admin, nil
}

func (r *Repository) FindByID(id string) (*domain.Admin, error) {
	var admin domain.Admin
	if err := r.db.Where("id = ?", id).First(&admin).Error; err != nil {
		return nil, err
	}
	return &admin, nil
}

func (r *Repository) Create(admin *domain.Admin) error {
	return r.db.Create(admin).Error
}

func (r *Repository) Save(admin *domain.Admin) error {
	return r.db.Save(admin).Error
}

func (r *Repository) FindByInviteToken(token string) (*domain.Admin, error) {
	var admin domain.Admin
	if err := r.db.Where("invite_token = ?", token).First(&admin).Error; err != nil {
		return nil, err
	}
	return &admin, nil
}

func (r *Repository) FindByResetToken(token string) (*domain.Admin, error) {
	var admin domain.Admin
	if err := r.db.Where("reset_token = ?", token).First(&admin).Error; err != nil {
		return nil, err
	}
	return &admin, nil
}

func (r *Repository) SaveRefreshToken(token *domain.AdminRefreshToken) error {
	return r.db.Create(token).Error
}

func (r *Repository) FindRefreshToken(tokenStr string) (*domain.AdminRefreshToken, error) {
	var t domain.AdminRefreshToken
	if err := r.db.Where("token = ?", tokenStr).First(&t).Error; err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *Repository) DeleteRefreshToken(tokenStr string) error {
	return r.db.Where("token = ?", tokenStr).Delete(&domain.AdminRefreshToken{}).Error
}
