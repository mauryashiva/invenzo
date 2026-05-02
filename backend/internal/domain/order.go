// internal/domain/order.go
package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Order struct {
	ID          string      `gorm:"type:uuid;primaryKey" json:"id"`
	OrderNumber string      `gorm:"uniqueIndex;not null" json:"order_number"`
	Status      string      `gorm:"default:'pending'" json:"status"`
	TotalAmount float64     `json:"total_amount"`
	Items       []OrderItem `gorm:"foreignKey:OrderID" json:"items,omitempty"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

func (o *Order) BeforeCreate(tx *gorm.DB) error {
	if o.ID == "" {
		o.ID = uuid.NewString()
	}
	return nil
}

type OrderItem struct {
	ID        uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderID   string  `gorm:"type:uuid;index;not null" json:"order_id"`
	VariantID string  `gorm:"type:uuid;not null" json:"variant_id"`
	SKU       string  `json:"sku"`
	Quantity  int     `json:"quantity"`
	UnitPrice float64 `json:"unit_price"`
}
