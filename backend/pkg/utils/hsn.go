// pkg/utils/hsn.go
package utils

import (
	"fmt"
	"strings"
)

// HSNRegistry maps hierarchy to base HSN codes
var HSNRegistry = map[string]string{
	"fashion:apparel":     "6109",
	"fashion:footwear":    "6403",
	"fashion:accessories": "4202",
	"electronics:default": "8517",
	"automotive:default":  "8708",
}

// GenerateHSN generates a dynamic HSN code
func GenerateHSN(department, prodType, category string) string {
	key := fmt.Sprintf("%s:%s", strings.ToLower(department), strings.ToLower(prodType))
	base, ok := HSNRegistry[key]
	if !ok {
		// Try department default
		key = fmt.Sprintf("%s:default", strings.ToLower(department))
		base, ok = HSNRegistry[key]
		if !ok {
			base = "0000"
		}
	}

	// Dynamic suffix based on category name length and first char (just as an example for dynamic generation)
	suffix := "00"
	if len(category) > 0 {
		suffix = fmt.Sprintf("%02d", (int(category[0]) + len(category)) % 100)
	}

	return base + suffix
}
