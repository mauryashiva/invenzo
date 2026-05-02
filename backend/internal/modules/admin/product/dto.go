// internal/modules/admin/product/dto.go
package product

// CreateProductRequest — mirrors the frontend InventoryProduct form state exactly.
type CreateProductRequest struct {
	BrandID     string `json:"brand_id" validate:"required"`
	Name        string `json:"name" validate:"required"`
	ModelNumber string `json:"model_number"`
	StyleCode   string `json:"style_code"`

	CategoryID  string `json:"category_id" validate:"required"` // electronics | fashion
	FashionType string `json:"fashion_type"`                    // apparel | footwear | accessories
	Gender      string `json:"gender"`
	Category    string `json:"category" validate:"required"`    // smartphone | jeans | etc.

	PurchaseGST float64 `json:"purchase_gst"`
	SalesGST    float64 `json:"sales_gst"`
	Warranty    int     `json:"warranty"`

	// Electronics
	Specs    []SpecEntryDTO `json:"specs"`
	Features []string       `json:"features"`

	// Fashion
	SelectedSizes    []string               `json:"selected_sizes"`
	SizeGuideData    map[string]interface{} `json:"size_guide_data"`
	Occasion         string                 `json:"occasion"`
	Season           string                 `json:"season"`
	Fabric           string                 `json:"fabric"`
	CareInstructions string                 `json:"care_instructions"`

	Description string         `json:"description"`
	Variants    []VariantDTO   `json:"variants" validate:"required,min=1"`
}

type SpecEntryDTO struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type VariantDTO struct {
	SKU        string               `json:"sku"`
	Color      string               `json:"color" validate:"required"`
	ColorName  string               `json:"color_name" validate:"required"`
	Attributes []VariantAttributeDTO `json:"attributes"`
	BaseCost     float64 `json:"base_cost"`
	SellingPrice float64 `json:"selling_price"`
	ReorderLevel int     `json:"reorder_level"`
	Images       []string `json:"images"`
}

type VariantAttributeDTO struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

// UpdateProductRequest — all fields optional (PATCH semantics)
type UpdateProductRequest struct {
	Name        *string `json:"name"`
	Description *string `json:"description"`
	IsActive    *bool   `json:"is_active"`
	PurchaseGST *float64 `json:"purchase_gst"`
	SalesGST    *float64 `json:"sales_gst"`
}

// ProductListQuery — pagination + filters
type ProductListQuery struct {
	Page       int    `query:"page"`
	Limit      int    `query:"limit"`
	CategoryID string `query:"category_id"`
	Category   string `query:"category"`
	Search     string `query:"search"`
}
