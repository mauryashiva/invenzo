// internal/modules/admin/tax/dto.go
package tax

type CalculateTaxRequest struct {
	Department   string  `json:"department" validate:"required"`
	Type         string  `json:"type"`
	Category     string  `json:"category" validate:"required"`
	SubCategory  string  `json:"sub_category"`
	SellingPrice float64 `json:"selling_price"`
}

type TaxResponse struct {
	SalesGST float64 `json:"sales_gst"`
	HSN      string  `json:"hsn"`
}
