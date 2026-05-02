// common/middleware/cors.go
// CORS reads ALLOWED_ORIGINS from config — change .env to add new origins.
package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/mauryashiva/invenzo-backend/common/config"
)

func CORS() fiber.Handler {
	cfg := config.Get()
	origins := strings.Split(cfg.AllowedOrigins, ",")
	_ = origins // used in AllowOriginsFunc below

	return cors.New(cors.Config{
		AllowOriginsFunc: func(origin string) bool {
			for _, o := range origins {
				if strings.TrimSpace(o) == origin {
					return true
				}
			}
			return false
		},
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Authorization",
		AllowCredentials: true,
	})
}
