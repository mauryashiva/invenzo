// internal/modules/admin/inventory/routes.go
package inventory

import (
	"github.com/gofiber/fiber/v2"
	"github.com/mauryashiva/invenzo-backend/common/database"
)

func Register(router fiber.Router) {
	repo := NewRepository(database.GetDB())
	svc := NewService(repo)
	h := NewHandler(svc)

	inv := router.Group("/inventory")
	inv.Get("/units", h.ListUnits)
	inv.Get("/units/count", h.StockCount)
	inv.Post("/units", h.AddUnit)
	inv.Post("/units/bulk", h.BulkAdd)
	inv.Patch("/units/:id", h.UpdateUnit)
	inv.Delete("/units/:id", h.DeleteUnit)
}
