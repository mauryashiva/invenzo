// internal/modules/admin/auth/dto.go
// Data Transfer Objects — what the API accepts and returns.
package auth

// LoginRequest — POST /api/v1/admin/auth/login
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

// InviteAdminRequest — POST /api/v1/admin/auth/invite (super_admin only)
type InviteAdminRequest struct {
	Name  string `json:"name" validate:"required"`
	Email string `json:"email" validate:"required,email"`
	Role  string `json:"role" validate:"required,oneof=admin super_admin"`
}

// AcceptInviteRequest — POST /api/v1/admin/auth/accept-invite
// Admin clicks the link, sets their password for the first time.
type AcceptInviteRequest struct {
	Token    string `json:"token" validate:"required"`
	Password string `json:"password" validate:"required,min=8"`
}

// ForgotPasswordRequest — POST /api/v1/admin/auth/forgot-password
type ForgotPasswordRequest struct {
	Email string `json:"email" validate:"required,email"`
}

// ResetPasswordRequest — POST /api/v1/admin/auth/reset-password
type ResetPasswordRequest struct {
	Token    string `json:"token" validate:"required"`
	Password string `json:"password" validate:"required,min=8"`
}

// AuthResponse — returned after login/refresh
type AuthResponse struct {
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token"`
	Admin        AdminInfo `json:"admin"`
}

// AdminInfo — safe admin fields (no password hash)
type AdminInfo struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

// RefreshRequest — POST /api/v1/admin/auth/refresh
type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

