// cmd/api/main.go
// Fiber app bootstrap — the ONLY file that wires everything together.
// Order: Config → DB → Migrations → Middleware → Routes → Listen
package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/mauryashiva/invenzo-backend/common/config"
	"github.com/mauryashiva/invenzo-backend/common/database"
	"github.com/mauryashiva/invenzo-backend/common/database/migrations"
	"github.com/mauryashiva/invenzo-backend/common/middleware"
	adminAuth      "github.com/mauryashiva/invenzo-backend/internal/modules/admin/auth"
	adminInventory "github.com/mauryashiva/invenzo-backend/internal/modules/admin/inventory"
	adminProduct   "github.com/mauryashiva/invenzo-backend/internal/modules/admin/product"
	adminTax       "github.com/mauryashiva/invenzo-backend/internal/modules/admin/tax"
)

func main() {
	// 1. Load config from .env — all other packages use config.Get()
	config.Load()
	cfg := config.Get()

	// 2. Connect to Supabase PostgreSQL
	database.Connect()

	// 3. Auto-migrate all domain models (safe to run every boot)
	migrations.Run()

	// 4. Create Fiber app
	app := fiber.New(fiber.Config{
		AppName:      "Invenzo SCM API v1",
		ErrorHandler: customErrorHandler,
	})

	// 5. Global middleware (applied to ALL routes)
	app.Use(middleware.Recovery())
	app.Use(middleware.Logger())
	app.Use(middleware.CORS())

	// 6. Health check (public)
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "app": "Invenzo SCM"})
	})

	// 7. API v1 root
	api := app.Group("/api/v1")

	// ── PUBLIC ADMIN AUTH (no middleware) ─────────────────────────────────
	adminAuth.Register(api)

	// ── PROTECTED ADMIN ROUTES (AdminAuth middleware on entire group) ──────
	admin := api.Group("/admin", middleware.AdminAuth)
	adminProduct.Register(admin)
	adminInventory.Register(admin)
	adminTax.Register(admin)
	// Add more admin modules here as you build them:
	// adminOrders.Register(admin)
	// adminDashboard.Register(admin)
	// adminWarranty.Register(admin)

	// ── USER ROUTES (add later) ───────────────────────────────────────────
	// user := api.Group("/user", middleware.UserAuth)
	// userCatalog.Register(user)

	// 8. Start server
	log.Printf("🚀 Invenzo SCM API running on :%s [%s]", cfg.AppPort, cfg.AppEnv)
	if err := app.Listen(":" + cfg.AppPort); err != nil {
		log.Fatalf("❌ Server failed: %v", err)
	}
}

// customErrorHandler — catches any unhandled errors and returns standard JSON
func customErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
	}
	return c.Status(code).JSON(fiber.Map{
		"success": false,
		"error":   err.Error(),
	})
}
