// internal/modules/admin/product/routes.go
package product

import (
	"github.com/gofiber/fiber/v2"
	"github.com/mauryashiva/invenzo-backend/common/database"
)

// Register mounts product routes onto the admin router group.
// All routes here are already protected by AdminAuth middleware (applied at router level).
func Register(router fiber.Router) {
	repo := NewRepository(database.GetDB())
	svc := NewService(repo)
	h := NewHandler(svc)

	products := router.Group("/products")
	products.Get("/", h.List)
	products.Get("/:id", h.GetByID)
	products.Post("/", h.Create)
	products.Put("/:id", h.Update)
	products.Delete("/:id", h.Delete)
}
