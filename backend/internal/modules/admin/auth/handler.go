// internal/modules/admin/auth/handler.go
package auth

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/mauryashiva/invenzo-backend/common/response"
)

type Handler struct {
	service  *Service
	validate *validator.Validate
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service, validate: validator.New()}
}

// Login  POST /api/v1/admin/auth/login
func (h *Handler) Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}
	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, err.Error())
	}
	res, err := h.service.Login(req)
	if err != nil {
		return response.Unauthorized(c, err.Error())
	}
	return response.Success(c, "Login successful", res)
}

// InviteAdmin  POST /api/v1/admin/auth/invite  (super_admin only — enforced via middleware)
func (h *Handler) InviteAdmin(c *fiber.Ctx) error {
	var req InviteAdminRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}
	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, err.Error())
	}
	invitedByID := c.Locals("adminID").(string)
	if err := h.service.InviteAdmin(req, invitedByID); err != nil {
		return response.BadRequest(c, err.Error())
	}
	return response.Success(c, "Invitation sent successfully", nil)
}

// AcceptInvite  POST /api/v1/admin/auth/accept-invite  (public — token validates identity)
func (h *Handler) AcceptInvite(c *fiber.Ctx) error {
	var req AcceptInviteRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}
	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, err.Error())
	}
	res, err := h.service.AcceptInvite(req)
	if err != nil {
		return response.BadRequest(c, err.Error())
	}
	return response.Success(c, "Account activated. Welcome to Invenzo!", res)
}

// ForgotPassword  POST /api/v1/admin/auth/forgot-password
func (h *Handler) ForgotPassword(c *fiber.Ctx) error {
	var req ForgotPasswordRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}
	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, err.Error())
	}
	_ = h.service.ForgotPassword(req)
	// Always return success — don't leak whether email exists
	return response.Success(c, "If that email is registered, a reset link has been sent.", nil)
}

// ResetPassword  POST /api/v1/admin/auth/reset-password
func (h *Handler) ResetPassword(c *fiber.Ctx) error {
	var req ResetPasswordRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}
	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, err.Error())
	}
	if err := h.service.ResetPassword(req); err != nil {
		return response.BadRequest(c, err.Error())
	}
	return response.Success(c, "Password reset successful. You can now log in.", nil)
}

// Refresh  POST /api/v1/admin/auth/refresh
func (h *Handler) Refresh(c *fiber.Ctx) error {
	var req RefreshRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}
	res, err := h.service.Refresh(req)
	if err != nil {
		return response.Unauthorized(c, err.Error())
	}
	return response.Success(c, "Token refreshed", res)
}
