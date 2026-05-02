// common/constants/inventory_status.go
package constants

const (
	// Stock Unit conditions
	ConditionNew         = "New"
	ConditionOpenBox     = "Open Box"
	ConditionRefurbished = "Refurbished"

	// Stock Unit statuses
	StatusInStock   = "In stock"
	StatusSold      = "Sold"
	StatusDefective = "Defective"

	// Department / CategoryID values (mirrors frontend categoryId)
	DepartmentElectronics = "electronics"
	DepartmentFashion     = "fashion"
	DepartmentAutomotive  = "automotive"

	// Fashion types (mirrors frontend fashionType)
	FashionTypeApparel     = "apparel"
	FashionTypeFootwear    = "footwear"
	FashionTypeAccessories = "accessories"
)
