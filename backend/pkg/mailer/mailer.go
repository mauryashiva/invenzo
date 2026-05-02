// pkg/mailer/mailer.go
// Resend-powered email sender.
// Used for: admin invitations, password reset links.
package mailer

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/mauryashiva/invenzo-backend/common/config"
)

type emailPayload struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	HTML    string   `json:"html"`
}

// Send dispatches an email via the Resend API.
func Send(to, subject, html string) error {
	cfg := config.Get()

	payload := emailPayload{
		From:    fmt.Sprintf("Invenzo <%s>", cfg.EmailFrom),
		To:      []string{to},
		Subject: subject,
		HTML:    html,
	}

	body, _ := json.Marshal(payload)
	req, err := http.NewRequest("POST", "https://api.resend.com/emails", bytes.NewBuffer(body))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+cfg.ResendAPIKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		raw, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("resend API error %d: %s", resp.StatusCode, string(raw))
	}
	return nil
}

// SendAdminInvitation sends the invite link email to a new admin.
func SendAdminInvitation(toEmail, inviteeName, inviteToken string) error {
	cfg := config.Get()
	link := fmt.Sprintf("%s/auth/accept-invite?token=%s", cfg.AdminFrontendURL, inviteToken)

	html := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<body style="font-family: Inter, sans-serif; background: #f8fafc; padding: 40px;">
  <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
    <h1 style="color: #1e293b; font-size: 22px; margin-bottom: 8px;">You're invited to Invenzo</h1>
    <p style="color: #64748b; font-size: 15px;">Hi <strong>%s</strong>, you've been invited to join the Invenzo admin dashboard.</p>
    <p style="color: #64748b; font-size: 14px;">Click the button below to set your password and activate your account. This link expires in <strong>24 hours</strong>.</p>
    <a href="%s" style="display:inline-block;margin-top:24px;padding:14px 32px;background:#4f46e5;color:#fff;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">
      Accept Invitation
    </a>
    <p style="margin-top:32px;color:#94a3b8;font-size:12px;">If you didn't expect this email, you can safely ignore it.</p>
  </div>
</body>
</html>`, inviteeName, link)

	return Send(toEmail, "You're invited to Invenzo Admin", html)
}

// SendPasswordReset sends a password reset link.
func SendPasswordReset(toEmail, resetToken string) error {
	cfg := config.Get()
	link := fmt.Sprintf("%s/auth/reset-password?token=%s", cfg.AdminFrontendURL, resetToken)

	html := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<body style="font-family: Inter, sans-serif; background: #f8fafc; padding: 40px;">
  <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
    <h1 style="color: #1e293b; font-size: 22px; margin-bottom: 8px;">Reset your password</h1>
    <p style="color: #64748b; font-size: 15px;">We received a request to reset the password for your Invenzo admin account.</p>
    <p style="color: #64748b; font-size: 14px;">Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
    <a href="%s" style="display:inline-block;margin-top:24px;padding:14px 32px;background:#4f46e5;color:#fff;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">
      Reset Password
    </a>
    <p style="margin-top:32px;color:#94a3b8;font-size:12px;">If you didn't request this, you can safely ignore it.</p>
  </div>
</body>
</html>`, link)

	return Send(toEmail, "Reset your Invenzo password", html)
}
