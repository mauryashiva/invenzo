// internal/modules/admin/tax/routes.go
package tax

import (
	"github.com/gofiber/fiber/v2"
)

func Register(router fiber.Router) {
	svc := NewService()
	h := NewHandler(svc)

	tax := router.Group("/tax")
	tax.Post("/calculate", h.CalculateTax)
}
