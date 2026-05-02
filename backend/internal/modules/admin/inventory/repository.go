// internal/modules/admin/inventory/repository.go
package inventory

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

func (r *Repository) CreateUnit(unit *domain.StockUnit) error {
	return r.db.Create(unit).Error
}

func (r *Repository) BulkCreateUnits(units []domain.StockUnit) error {
	return r.db.Create(&units).Error
}

func (r *Repository) FindUnits(query StockListQuery) ([]domain.StockUnit, int64, error) {
	var units []domain.StockUnit
	var total int64

	page := query.Page
	if page < 1 {
		page = 1
	}
	limit := query.Limit
	if limit < 1 {
		limit = 50
	}
	offset := (page - 1) * limit

	db := r.db.Model(&domain.StockUnit{})
	if query.VariantID != "" {
		db = db.Where("variant_id = ?", query.VariantID)
	}
	if query.Status != "" {
		db = db.Where("status = ?", query.Status)
	}

	db.Count(&total)
	err := db.Limit(limit).Offset(offset).Find(&units).Error
	return units, total, err
}

func (r *Repository) FindUnitByID(id string) (*domain.StockUnit, error) {
	var unit domain.StockUnit
	err := r.db.Where("id = ?", id).First(&unit).Error
	return &unit, err
}

func (r *Repository) UpdateUnit(id string, updates map[string]interface{}) error {
	return r.db.Model(&domain.StockUnit{}).Where("id = ?", id).Updates(updates).Error
}

func (r *Repository) DeleteUnit(id string) error {
	return r.db.Where("id = ?", id).Delete(&domain.StockUnit{}).Error
}

// CountByVariant — used to compute variant.stock in real time
func (r *Repository) CountByVariant(variantID string) (int64, error) {
	var count int64
	err := r.db.Model(&domain.StockUnit{}).
		Where("variant_id = ? AND status = 'In stock'", variantID).
		Count(&count).Error
	return count, err
}
