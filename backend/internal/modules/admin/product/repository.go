// internal/modules/admin/product/repository.go
package product

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

func (r *Repository) Create(product *domain.Product) error {
	return r.db.Create(product).Error
}

func (r *Repository) FindAll(query ProductListQuery) ([]domain.Product, int64, error) {
	var products []domain.Product
	var total int64

	page := query.Page
	if page < 1 {
		page = 1
	}
	limit := query.Limit
	if limit < 1 {
		limit = 20
	}
	offset := (page - 1) * limit

	db := r.db.Model(&domain.Product{}).
		Preload("Brand").
		Preload("Variants").
		Preload("Variants.Attributes")

	if query.CategoryID != "" {
		db = db.Where("category_id = ?", query.CategoryID)
	}
	if query.Category != "" {
		db = db.Where("category = ?", query.Category)
	}
	if query.Search != "" {
		db = db.Where("name ILIKE ?", "%"+query.Search+"%")
	}

	db.Count(&total)
	err := db.Limit(limit).Offset(offset).Find(&products).Error
	return products, total, err
}

func (r *Repository) FindByID(id string) (*domain.Product, error) {
	var product domain.Product
	err := r.db.
		Preload("Brand").
		Preload("Variants").
		Preload("Variants.Attributes").
		Where("id = ?", id).
		First(&product).Error
	return &product, err
}

func (r *Repository) Update(id string, updates map[string]interface{}) error {
	return r.db.Model(&domain.Product{}).Where("id = ?", id).Updates(updates).Error
}

func (r *Repository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&domain.Product{}).Error
}
