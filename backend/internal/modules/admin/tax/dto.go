// internal/modules/admin/tax/dto.go
package tax

// CalculateTaxRequest defines the JSON structure for the API endpoint
type CalculateTaxRequest struct {
	Department   string  `json:"department" validate:"required"`
	Type         string  `json:"type"`
	Category     string  `json:"category" validate:"required"`
	SubCategory  string  `json:"sub_category"` // Maps to Gender in your state
	SellingPrice float64 `json:"selling_price"`
}

// TaxResponse defines the data returned to the frontend
type TaxResponse struct {
	SalesGST float64 `json:"sales_gst"`
	HSN      string  `json:"hsn"`
}