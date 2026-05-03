// internal/modules/admin/tax/service.go
package tax

import (
	"strings"

	"github.com/mauryashiva/invenzo-backend/pkg/utils"
)

type Service struct{}

func NewService() *Service {
	return &Service{}
}

// TaxRequest defines the input for tax calculation
type TaxRequest struct {
	Department   string
	Type         string // apparel, footwear, etc.
	Category     string // smartphone, jeans, etc.
	SubCategory  string // men, women, etc. (often used as gender in fashion)
	SellingPrice float64
}

// ResolveTaxLabel maps the hierarchy to a TaxLabel
func (s *Service) ResolveTaxLabel(req TaxRequest) TaxLabel {
	dept := strings.ToLower(strings.TrimSpace(req.Department))
	prodType := strings.ToLower(strings.TrimSpace(req.Type))
	category := strings.ToLower(strings.TrimSpace(req.Category))

	switch dept {
	case "fashion":
		switch prodType {
		case "apparel":
			return LabelFashionApparel
		case "footwear":
			return LabelFashionFootwear
		case "accessories":
			return LabelFashionAccessories
		}
	case "electronics":
		switch category {
		case "smartphone":
			return LabelElectronicsPhones
		case "laptop", "tablet":
			return LabelElectronicsLaptops
		}
		return LabelElectronics
	case "automotive":
		return LabelAutomotive
	}
	return LabelDefault
}

// CalculateSalesGST resolves the GST percentage based on label and price threshold
func (s *Service) CalculateSalesGST(req TaxRequest) float64 {
	label := s.ResolveTaxLabel(req)
	config, ok := TaxRegistry[label]
	if !ok {
		return float64(Slab18) // Fallback
	}

	switch v := config.(type) {
	case GstSlab:
		return float64(v)
	case ThresholdConfig:
		if req.SellingPrice >= v.Threshold {
			return float64(v.AboveSlab)
		}
		return float64(v.BelowSlab)
	}

	return float64(Slab18)
}

// GenerateHSN creates a dynamic HSN code based on hierarchy
func (s *Service) GenerateHSN(req TaxRequest) string {
	return utils.GenerateHSN(req.Department, req.Type, req.Category)
}
