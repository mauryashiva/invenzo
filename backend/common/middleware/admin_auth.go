// common/middleware/admin_auth.go
// Protects all /api/v1/admin/* routes.
// Verifies JWT and checks role is "admin" or "super_admin".
package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/mauryashiva/invenzo-backend/common/constants"
	"github.com/mauryashiva/invenzo-backend/common/response"
	"github.com/mauryashiva/invenzo-backend/pkg/jwt"
)

// AdminAuth middleware — attach to every admin route group.
func AdminAuth(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return response.Unauthorized(c, "Missing or invalid Authorization header")
	}

	tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
	claims, err := jwt.Parse(tokenStr)
	if err != nil {
		return response.Unauthorized(c, "Invalid or expired token")
	}

	if claims.Role != constants.RoleAdmin && claims.Role != constants.RoleSuperAdmin {
		return response.Forbidden(c, "Admin access required")
	}

	// Attach claims to context — handlers read these via c.Locals()
	c.Locals("adminID", claims.UserID)
	c.Locals("adminEmail", claims.Email)
	c.Locals("adminRole", claims.Role)

	return c.Next()
}
