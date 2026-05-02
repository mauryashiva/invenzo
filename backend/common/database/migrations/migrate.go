// common/database/migrations/migrate.go
// Auto-migrates all domain models to Supabase PostgreSQL.
// Add new models here — one line per table.
package migrations

import (
	"log"

	"github.com/mauryashiva/invenzo-backend/common/database"
	"github.com/mauryashiva/invenzo-backend/internal/domain"
)

// Run creates/updates all tables based on domain structs.
// Safe to call on every startup — GORM only adds missing columns.
func Run() {
	db := database.GetDB()

	err := db.AutoMigrate(
		// Auth
		&domain.Admin{},
		&domain.AdminRefreshToken{},

		// Catalogue
		&domain.Brand{},
		&domain.Product{},
		&domain.Variant{},
		&domain.VariantAttribute{},

		// Stock
		&domain.StockUnit{},

		// Orders
		&domain.Order{},
		&domain.OrderItem{},

		// Warranty
		&domain.Warranty{},
		&domain.WarrantyTransfer{},
	)
	if err != nil {
		log.Fatalf("❌ Migration failed: %v", err)
	}

	log.Println("✅ Database migrations completed")
}
