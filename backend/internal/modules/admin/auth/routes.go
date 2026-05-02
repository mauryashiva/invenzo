// internal/modules/admin/auth/routes.go
package auth

import (
	"github.com/gofiber/fiber/v2"
	"github.com/mauryashiva/invenzo-backend/common/database"
	"github.com/mauryashiva/invenzo-backend/common/middleware"
)

// Register mounts all auth routes.
// Public routes: login, accept-invite, forgot-password, reset-password
// Protected routes: invite (super_admin only)
func Register(router fiber.Router) {
	repo := NewRepository(database.GetDB())
	svc := NewService(repo)
	h := NewHandler(svc)

	auth := router.Group("/admin/auth")

	// ── Public (no JWT needed) ─────────────────────────────────────────────
	auth.Post("/login", h.Login)
	auth.Post("/accept-invite", h.AcceptInvite)
	auth.Post("/forgot-password", h.ForgotPassword)
	auth.Post("/reset-password", h.ResetPassword)
	auth.Post("/refresh", h.Refresh)

	// ── Protected: only authenticated super_admin can send invites ─────────
	auth.Post("/invite", middleware.AdminAuth, h.InviteAdmin)
}
