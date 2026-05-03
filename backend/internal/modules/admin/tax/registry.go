// internal/modules/admin/tax/registry.go
package tax

// TaxLabel represents a logical tax category (e.g., "FASHION_APPAREL")
type TaxLabel string

const (
	LabelFashionApparel     TaxLabel = "FASHION_APPAREL"
	LabelFashionFootwear    TaxLabel = "FASHION_FOOTWEAR"
	LabelFashionAccessories TaxLabel = "FASHION_ACCESSORIES"
	LabelElectronics         TaxLabel = "ELECTRONICS"
	LabelElectronicsPhones   TaxLabel = "ELECTRONICS_PHONES"
	LabelElectronicsLaptops  TaxLabel = "ELECTRONICS_LAPTOPS"
	LabelAutomotive          TaxLabel = "AUTOMOTIVE"
	LabelDefault             TaxLabel = "DEFAULT"
)

// GstSlab represents a GST percentage slab
type GstSlab float64

const (
	Slab0  GstSlab = 0
	Slab5  GstSlab = 5
	Slab12 GstSlab = 12
	Slab18 GstSlab = 18
	Slab28 GstSlab = 28
)

// ThresholdConfig defines price-based taxation
type ThresholdConfig struct {
	Threshold float64
	BelowSlab GstSlab
	AboveSlab GstSlab
}

// TaxRegistry maps labels to GST slabs or threshold configurations
var TaxRegistry = map[TaxLabel]interface{}{
	LabelFashionApparel: ThresholdConfig{
		Threshold: 2500,
		BelowSlab: Slab5,
		AboveSlab: Slab12,
	},
	LabelFashionFootwear: ThresholdConfig{
		Threshold: 2500,
		BelowSlab: Slab5,
		AboveSlab: Slab12,
	},
	LabelFashionAccessories: Slab18,
	LabelElectronics:        Slab18,
	LabelElectronicsPhones:  Slab12,
	LabelElectronicsLaptops: Slab18,
	LabelAutomotive:         Slab28,
	LabelDefault:            Slab18,
}

// HSNPrefixRegistry maps hierarchy levels to HSN prefixes
// Format: Department -> Type -> Prefix (first 4 digits)
var HSNPrefixRegistry = map[string]map[string]string{
	"fashion": {
		"apparel":     "6100",
		"footwear":    "6400",
		"accessories": "4200",
	},
	"electronics": {
		"default": "8500",
	},
	"automotive": {
		"default": "8700",
	},
}
