// pkg/utils/hsn.go
package utils

import (
	"fmt"
	"strings"
)

/**
 * 🛠️ HSN REGISTRY (Industry Standard 2026)
 * 8517: Smartphones / Communication devices
 * 8471: Laptops / Tablets / Data processing units
 * 6109: Apparel (Knitted)
 * 6403: Footwear
 * 4202: Accessories (Bags/Wallets)
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

/**
 * GenerateHSN creates a professional 6-digit HSN code.
 * It follows a hierarchical lookup: Category -> Type -> Department Default.
 */
func GenerateHSN(department, prodType, category string) string {
	// Clean inputs to ensure matches even with accidental spaces/casing
	department = strings.ToLower(strings.TrimSpace(department))
	prodType = strings.ToLower(strings.TrimSpace(prodType))
	category = strings.ToLower(strings.TrimSpace(category))

	// 🎯 1. Try Category specific (e.g., electronics:laptop -> 8471)
	key := fmt.Sprintf("%s:%s", department, category)
	base, ok := HSNRegistry[key]

	// 🎯 2. Try Type specific (e.g., fashion:apparel -> 6109)
	if !ok {
		key = fmt.Sprintf("%s:%s", department, prodType)
		base, ok = HSNRegistry[key]
	}

	// 🎯 3. Try Department default fallback
	if !ok {
		key = fmt.Sprintf("%s:default", department)
		base, ok = HSNRegistry[key]
		if !ok {
			base = "9999" // Generic fallback for unknown goods
		}
	}

	// Suffix logic: Real HSNs for retail are typically 6 or 8 digits.
	// We use "10" as a standard sub-classification suffix.
	suffix := "10" 
	return base + suffix
}