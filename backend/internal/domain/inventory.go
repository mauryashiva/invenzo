// internal/domain/inventory.go
// StockUnit — mirrors frontend StockUnit type.
// For Electronics: serialNumber + IMEI1/2
// For Fashion: serialNumber acts as Barcode, imei1 acts as Style Code
package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type StockUnit struct {
	ID           string         `gorm:"type:uuid;primaryKey" json:"id"`
	VariantID    string         `gorm:"type:uuid;index;not null" json:"variant_id"`
	Variant      Variant        `gorm:"foreignKey:VariantID" json:"variant,omitempty"`

	SerialNumber string `json:"serial_number"` // Electronics: Serial | Fashion: Barcode
	IMEI1        string `json:"imei1"`         // Electronics: IMEI 1  | Fashion: Style Code
	IMEI2        string `json:"imei2"`         // Electronics: IMEI 2  | Fashion: (unused)

	Condition string `gorm:"default:'New'" json:"condition"` // New | Open Box | Refurbished
	Status    string `gorm:"default:'In stock'" json:"status"` // In stock | Sold | Defective

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (s *StockUnit) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = uuid.NewString()
	}
	return nil
}
