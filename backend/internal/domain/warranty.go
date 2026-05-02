// internal/domain/warranty.go
package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Warranty struct {
	ID          string    `gorm:"type:uuid;primaryKey" json:"id"`
	ProductID   string    `gorm:"type:uuid;index;not null" json:"product_id"`
	VariantID   string    `gorm:"type:uuid;index;not null" json:"variant_id"`
	SKU         string    `json:"sku"`
	SerialNumber string   `gorm:"index" json:"serial_number"`
	OwnerName   string    `json:"owner_name"`
	OwnerEmail  string    `json:"owner_email"`
	OwnerPhone  string    `json:"owner_phone"`
	StartDate   time.Time `json:"start_date"`
	ExpiryDate  time.Time `json:"expiry_date"`
	IsActive    bool      `gorm:"default:true" json:"is_active"`

	Transfers []WarrantyTransfer `gorm:"foreignKey:WarrantyID" json:"transfers,omitempty"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (w *Warranty) BeforeCreate(tx *gorm.DB) error {
	if w.ID == "" {
		w.ID = uuid.NewString()
	}
	return nil
}

type WarrantyTransfer struct {
	ID             string    `gorm:"type:uuid;primaryKey" json:"id"`
	WarrantyID     string    `gorm:"type:uuid;index;not null" json:"warranty_id"`
	FromOwnerName  string    `json:"from_owner_name"`
	FromOwnerEmail string    `json:"from_owner_email"`
	ToOwnerName    string    `json:"to_owner_name"`
	ToOwnerEmail   string    `json:"to_owner_email"`
	TransferredAt  time.Time `json:"transferred_at"`
}

func (t *WarrantyTransfer) BeforeCreate(tx *gorm.DB) error {
	if t.ID == "" {
		t.ID = uuid.NewString()
	}
	return nil
}
