// pkg/utils/sku.go
// Mirrors the SKU generation logic from frontend/src/lib/sku.ts
// Format: BRAND-MODEL-COLOR-ATTR1-ATTR2 (uppercase, hyphenated)
package utils

import (
	"fmt"
	"strings"
)

type AttributeDTO struct {
	Key   string
	Value string
}

// GenerateSKU builds a deterministic SKU identical to the frontend generator.
func GenerateSKU(brand, model, colorName string, attrs []AttributeDTO) string {
	parts := []string{
		clean(brand),
		clean(model),
		clean(colorName),
	}
	for _, a := range attrs {
		if a.Value != "" {
			parts = append(parts, clean(a.Value))
		}
	}
	return strings.Join(parts, "-")
}

func clean(s string) string {
	s = strings.ToUpper(strings.TrimSpace(s))
	s = strings.ReplaceAll(s, " ", "")
	// Keep only alphanumeric chars
	var b strings.Builder
	for _, r := range s {
		if (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') {
			b.WriteRune(r)
		}
	}
	result := b.String()
	if len(result) > 10 {
		result = result[:10]
	}
	return fmt.Sprintf("%s", result)
}
