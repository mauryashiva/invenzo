// internal/modules/admin/inventory/dto.go
package inventory

// AddStockUnitRequest — adds a single unit (serial/barcode scan)
type AddStockUnitRequest struct {
	VariantID    string `json:"variant_id" validate:"required"`
	SerialNumber string `json:"serial_number" validate:"required"` // Barcode for fashion
	IMEI1        string `json:"imei1"`                             // Style Code for fashion
	IMEI2        string `json:"imei2"`                             // Electronics IMEI 2 only
	Condition    string `json:"condition" validate:"required,oneof=New 'Open Box' Refurbished"`
}

// BulkAddRequest — paste serials/barcodes in one shot (mirrors frontend bulk paste)
type BulkAddRequest struct {
	VariantID     string   `json:"variant_id" validate:"required"`
	SerialNumbers []string `json:"serial_numbers" validate:"required,min=1"` // Barcodes for fashion
	SecondaryIDs  []string `json:"secondary_ids"`                            // IMEIs or Style Codes
	Condition     string   `json:"condition" validate:"required"`
}

// UpdateStockUnitRequest — change condition or status
type UpdateStockUnitRequest struct {
	Condition *string `json:"condition"`
	Status    *string `json:"status"`
}

// StockListQuery — filter units by variant
type StockListQuery struct {
	VariantID string `query:"variant_id"`
	Status    string `query:"status"`
	Page      int    `query:"page"`
	Limit     int    `query:"limit"`
}
