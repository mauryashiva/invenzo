// pkg/utils/storage.go
package utils

import (
	"fmt"
	"regexp"
	"strings"
	"time"
)

/**
 * 📁 STORAGE PATH GENERATOR
 * Generates structured, SEO-friendly folder paths for media storage.
 * Pattern: inventory/{department}/{type}/{gender}/{category}/{product_name}/
 */
func GenerateStoragePath(department, prodType, gender, category, productName string) string {
	// Sanitize all hierarchy levels
	d := sanitizePath(department)
	t := sanitizePath(prodType)
	g := sanitizePath(gender)
	c := sanitizePath(category)
	p := sanitizePath(productName)

	// Build parts list - "inventory" acts as the root folder in Cloudinary/S3
	parts := []string{"inventory"}
	
	// Dynamically append non-empty parts to handle different category depths
	if d != "" { parts = append(parts, d) }
	if t != "" { parts = append(parts, t) }
	if g != "" { parts = append(parts, g) }
	if c != "" { parts = append(parts, c) }
	if p != "" { parts = append(parts, p) }

	// Result: "inventory/fashion/apparel/men/jeans/levis-511"
	return strings.Join(parts, "/")
}

/**
 * 📦 MEDIA FILE NAME GENERATOR
 * Generates a collision-resistant filename.
 * Pattern: {context}-{timestamp}-{clean_name}
 */
func GenerateFileName(originalName string, context string) string {
	timestamp := time.Now().Unix()
	
	// Sanitize the original filename (removes spaces and special chars)
	cleanName := sanitizePath(originalName)
	
	// Create a unique prefix based on context and time
	if context != "" {
		return fmt.Sprintf("%s-%d-%s", sanitizePath(context), timestamp, cleanName)
	}
	return fmt.Sprintf("%d-%s", timestamp, cleanName)
}

/**
 * 🛠️ SANITIZATION UTILITY
 * Cleans strings for URL-safe paths and filenames.
 */
func sanitizePath(input string) string {
	if input == "" {
		return ""
	}

	// 1. Convert to lowercase and trim
	res := strings.ToLower(strings.TrimSpace(input))

	// 2. Replace spaces with hyphens
	res = strings.ReplaceAll(res, " ", "-")

	// 3. FIX: Using raw string literal (backticks) for regexp.Compile
	// This avoids the S1007 "escape twice" error.
	// Logic: Keep lowercase letters, numbers, hyphens, and dots. Remove everything else.
	reg, _ := regexp.Compile(`[^a-z0-9\-.]+`)
	res = reg.ReplaceAllString(res, "")

	// 4. Clean up duplicate hyphens (e.g. "men--jeans" -> "men-jeans")
	res = strings.ReplaceAll(res, "--", "-")

	// 5. Trim hyphens from start/end
	return strings.Trim(res, "-")
}