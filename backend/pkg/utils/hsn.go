package utils

import (
	"fmt"
	"strings"
)

/**
 * 🛠️ HSN REGISTRY (Industry Standard)
 * 8517: Smartphones / Communication devices
 * 8471: Laptops / Tablets / Data processing units
 * 6109: Apparel (Knitted)
 * 6403: Footwear
 */
var HSNRegistry = map[string]string{
	// Electronics Specifics
	"electronics:smartphone": "8517",
	"electronics:laptop":     "8471",
	"electronics:tablet":     "8471",
	"electronics:default":    "8500",

	// Fashion Specifics
	"fashion:apparel":     "6109",
	"fashion:footwear":    "6403",
	"fashion:accessories": "4202",

	// Fallbacks
	"automotive:default": "8708",
}

// GenerateHSN generates a professional HSN code
func GenerateHSN(department, prodType, category string) string {
	department = strings.ToLower(strings.TrimSpace(department))
	prodType = strings.ToLower(strings.TrimSpace(prodType))
	category = strings.ToLower(strings.TrimSpace(category))

	// 🎯 1. Try Category specific (e.g., electronics:smartphone)
	key := fmt.Sprintf("%s:%s", department, category)
	base, ok := HSNRegistry[key]

	// 🎯 2. Try Type specific (e.g., fashion:apparel)
	if !ok {
		key = fmt.Sprintf("%s:%s", department, prodType)
		base, ok = HSNRegistry[key]
	}

	// 🎯 3. Try Department default
	if !ok {
		key = fmt.Sprintf("%s:default", department)
		base, ok = HSNRegistry[key]
		if !ok {
			base = "9999" // Service/Other fallback
		}
	}

	// Suffix logic: Real HSNs are usually 6 or 8 digits.
	// We'll use "10" for standard consumer goods.
	suffix := "10" 
	return base + suffix
}