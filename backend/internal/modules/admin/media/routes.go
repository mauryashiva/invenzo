package media

import (
	"github.com/gofiber/fiber/v2"
	"github.com/mauryashiva/invenzo-backend/common/middleware"
)

func RegisterRoutes(router fiber.Router, handler *Handler) {
	// Protected Admin Routes
	media := router.Group("/media", middleware.AdminAuth)
	{
		media.Post("/upload", handler.Upload)
		media.Delete("/:id", handler.Delete)
	}
}
