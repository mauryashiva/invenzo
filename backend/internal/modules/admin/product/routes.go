// internal/modules/admin/product/routes.go
package product

import (
	"github.com/gofiber/fiber/v2"
	"github.com/mauryashiva/invenzo-backend/internal/modules/admin/media"
	"gorm.io/gorm"
)

func Register(router fiber.Router, db *gorm.DB, mediaService *media.Service) {
	repo := NewRepository(db)
	svc := NewService(repo, mediaService, db)
	h := NewHandler(svc)

	products := router.Group("/products")
	products.Get("/", h.List)
	products.Get("/:id", h.GetByID)
	products.Post("/", h.Create)
	products.Put("/:id", h.Update)
	products.Delete("/:id", h.Delete)
}
