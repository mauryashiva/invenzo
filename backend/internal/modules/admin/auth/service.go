// internal/modules/admin/auth/service.go
// Full auth service: login, invite, accept-invite, forgot-password, reset-password, refresh.
package auth

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"time"

	"github.com/mauryashiva/invenzo-backend/internal/domain"
	jwtpkg "github.com/mauryashiva/invenzo-backend/pkg/jwt"
	"github.com/mauryashiva/invenzo-backend/pkg/mailer"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

// ── Login ─────────────────────────────────────────────────────────────────────

func (s *Service) Login(req LoginRequest) (*AuthResponse, error) {
	admin, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}
	if !admin.IsActive {
		return nil, errors.New("account not activated — please accept your invitation first")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid email or password")
	}
	return s.issueTokens(admin)
}

// ── Invite Admin (super_admin only) ──────────────────────────────────────────

func (s *Service) InviteAdmin(req InviteAdminRequest, invitedByID string) error {
	// Prevent duplicate invites
	if existing, _ := s.repo.FindByEmail(req.Email); existing != nil {
		return errors.New("an account with this email already exists")
	}

	token := generateSecureToken()
	expiry := time.Now().Add(24 * time.Hour)

	// Create admin record with empty password — not usable until accepted
	admin := &domain.Admin{
		Name:            req.Name,
		Email:           req.Email,
		PasswordHash:    "$placeholder$", // Will be replaced on accept
		Role:            req.Role,
		IsActive:        false,
		InviteToken:     token,
		InviteExpiresAt: &expiry,
		InvitedByID:     &invitedByID,
	}
	if err := s.repo.Create(admin); err != nil {
		return errors.New("failed to create admin record")
	}

	// Send invitation email via Resend
	if err := mailer.SendAdminInvitation(req.Email, req.Name, token); err != nil {
		// Non-fatal: log but don't fail the request
		// In production, use a job queue here
		_ = err
	}
	return nil
}

// ── Accept Invite (admin sets password) ───────────────────────────────────────

func (s *Service) AcceptInvite(req AcceptInviteRequest) (*AuthResponse, error) {
	admin, err := s.repo.FindByInviteToken(req.Token)
	if err != nil {
		return nil, errors.New("invalid or expired invitation link")
	}
	if admin.InviteExpiresAt == nil || time.Now().After(*admin.InviteExpiresAt) {
		return nil, errors.New("invitation link has expired — please request a new one")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	admin.PasswordHash = string(hash)
	admin.IsActive = true
	admin.InviteToken = ""   // Consume token
	admin.InviteExpiresAt = nil

	if err := s.repo.Save(admin); err != nil {
		return nil, err
	}
	return s.issueTokens(admin)
}

// ── Forgot Password ───────────────────────────────────────────────────────────

func (s *Service) ForgotPassword(req ForgotPasswordRequest) error {
	admin, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		// Don't reveal whether email exists
		return nil
	}

	token := generateSecureToken()
	expiry := time.Now().Add(1 * time.Hour)

	admin.ResetToken = token
	admin.ResetExpiresAt = &expiry
	_ = s.repo.Save(admin)

	_ = mailer.SendPasswordReset(admin.Email, token)
	return nil
}

// ── Reset Password ─────────────────────────────────────────────────────────────

func (s *Service) ResetPassword(req ResetPasswordRequest) error {
	admin, err := s.repo.FindByResetToken(req.Token)
	if err != nil {
		return errors.New("invalid or expired reset link")
	}
	if admin.ResetExpiresAt == nil || time.Now().After(*admin.ResetExpiresAt) {
		return errors.New("reset link has expired — please request a new one")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	admin.PasswordHash = string(hash)
	admin.ResetToken = ""
	admin.ResetExpiresAt = nil
	return s.repo.Save(admin)
}

// ── Refresh Token ─────────────────────────────────────────────────────────────

func (s *Service) Refresh(req RefreshRequest) (*AuthResponse, error) {
	claims, err := jwtpkg.Parse(req.RefreshToken)
	if err != nil {
		return nil, errors.New("invalid refresh token")
	}
	_, err = s.repo.FindRefreshToken(req.RefreshToken)
	if err != nil {
		return nil, errors.New("refresh token not found or revoked")
	}

	_ = s.repo.DeleteRefreshToken(req.RefreshToken)

	admin, err := s.repo.FindByID(claims.UserID)
	if err != nil {
		return nil, errors.New("admin not found")
	}
	return s.issueTokens(admin)
}

// ── Internal helpers ──────────────────────────────────────────────────────────

func (s *Service) issueTokens(admin *domain.Admin) (*AuthResponse, error) {
	accessToken, err := jwtpkg.GenerateAccessToken(admin.ID, admin.Email, admin.Role)
	if err != nil {
		return nil, err
	}
	refreshToken, err := jwtpkg.GenerateRefreshToken(admin.ID, admin.Email, admin.Role)
	if err != nil {
		return nil, err
	}

	expiry := time.Now().Add(168 * time.Hour)
	_ = s.repo.SaveRefreshToken(&domain.AdminRefreshToken{
		AdminID:   admin.ID,
		Token:     refreshToken,
		ExpiresAt: expiry,
	})

	return &AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		Admin: AdminInfo{
			ID:    admin.ID,
			Name:  admin.Name,
			Email: admin.Email,
			Role:  admin.Role,
		},
	}, nil
}

func generateSecureToken() string {
	b := make([]byte, 32)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}
