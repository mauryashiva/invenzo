// internal/domain/product.go
// Product, Variant, Brand — mirrors the frontend InventoryProduct type exactly.
// Change a field here → DB schema, API responses, and validation all update.
package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Brand — referenced by Product
type Brand struct {
	ID        string         `gorm:"type:uuid;primaryKey" json:"id"`
	Name      string         `gorm:"uniqueIndex;not null" json:"name"`
	LogoURL   string         `json:"logo_url"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (b *Brand) BeforeCreate(tx *gorm.DB) error {
	if b.ID == "" {
		b.ID = uuid.NewString()
	}
	return nil
}

// Product — top-level product entity.
// Mirrors frontend InventoryProduct struct field-for-field.
type Product struct {
	ID          string         `gorm:"type:uuid;primaryKey" json:"id"`
	BrandID     string         `gorm:"type:uuid;index" json:"brand_id"`
	Brand       Brand          `gorm:"foreignKey:BrandID" json:"brand,omitempty"`
	Name        string         `gorm:"not null" json:"name"`
	ModelNumber string         `json:"model_number"` // Electronics
	StyleCode   string         `json:"style_code"`   // Fashion

	// Department hierarchy (mirrors frontend)
	CategoryID  string `gorm:"not null" json:"category_id"` // "electronics" | "fashion" | "automotive"
	FashionType string `json:"fashion_type"`                 // "apparel" | "footwear" | "accessories"
	Gender      string `json:"gender"`                       // "men" | "women" | "kids" | "unisex"
	Category    string `gorm:"not null" json:"category"`     // Sub-category e.g. "smartphone", "jeans"

	// Finance
	PurchaseGST float64 `gorm:"default:18" json:"purchase_gst"`
	SalesGST    float64 `gorm:"default:18" json:"sales_gst"`
	Warranty    int     `gorm:"default:12" json:"warranty"` // Months

	// Fashion-specific attributes
	Occasion         string `json:"occasion"`
	Season           string `json:"season"`
	Fabric           string `json:"fabric"`
	CareInstructions string `json:"care_instructions"`

	// Size system (stored as JSON array in Postgres)
	SelectedSizes []string          `gorm:"serializer:json" json:"selected_sizes"`
	SizeGuideData map[string]interface{} `gorm:"serializer:json" json:"size_guide_data"`

	// Tech specs (Electronics) — stored as JSON
	Specs    []SpecEntry `gorm:"serializer:json" json:"specs"`
	Features []string    `gorm:"serializer:json" json:"features"`

	Description string `json:"description"`
	IsActive    bool   `gorm:"default:true" json:"is_active"`

	Variants []Variant `gorm:"foreignKey:ProductID" json:"variants,omitempty"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (p *Product) BeforeCreate(tx *gorm.DB) error {
	if p.ID == "" {
		p.ID = uuid.NewString()
	}
	return nil
}

// SpecEntry — a key-value tech spec (e.g., "Display": "6.7-inch OLED")
type SpecEntry struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

// Variant — a single colour/size/spec combination of a product.
// Mirrors frontend Variant struct.
type Variant struct {
	ID        string `gorm:"type:uuid;primaryKey" json:"id"`
	ProductID string `gorm:"type:uuid;index;not null" json:"product_id"`
	SKU       string `gorm:"uniqueIndex;not null" json:"sku"`

	Color     string `json:"color"`      // Hex e.g. "#000000"
	ColorName string `json:"color_name"` // e.g. "Titanium Black"

	// Dynamic attributes (RAM/Storage for Electronics, Size/Fit for Fashion)
	Attributes []VariantAttribute `gorm:"foreignKey:VariantID" json:"attributes,omitempty"`

	BaseCost     float64 `json:"base_cost"`
	SellingPrice float64 `json:"selling_price"`
	ReorderLevel int     `gorm:"default:5" json:"reorder_level"`
	Stock        int     `gorm:"default:0" json:"stock"` // Computed from StockUnits count

	Images []string `gorm:"serializer:json" json:"images"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (v *Variant) BeforeCreate(tx *gorm.DB) error {
	if v.ID == "" {
		v.ID = uuid.NewString()
	}
	return nil
}

// VariantAttribute — one key-value spec for a Variant.
// e.g. {key:"RAM", value:"12GB"} or {key:"Size", value:"XL"}
type VariantAttribute struct {
	ID        uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	VariantID string `gorm:"type:uuid;index;not null" json:"variant_id"`
	Key       string `gorm:"not null" json:"key"`
	Value     string `gorm:"not null" json:"value"`
}
