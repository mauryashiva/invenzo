// common/config/config.go
// ONE SOURCE OF TRUTH — every package imports this.
// Change .env → entire app picks it up automatically.
package config

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	// Server
	AppPort string
	AppEnv  string

	// Database — Supabase PostgreSQL connection string
	DatabaseURL string

	// Redis
	RedisURL string

	// JWT
	JWTSecret          string
	JWTExpiry          time.Duration
	RefreshTokenExpiry time.Duration

	// CORS
	AllowedOrigins string

	// Cloudinary
	CloudinaryCloudName string
	CloudinaryAPIKey    string
	CloudinaryAPISecret string

	// Resend (email invitations, password reset)
	ResendAPIKey string
	EmailFrom    string

	// Frontend URLs (used in invitation/reset email links)
	AdminFrontendURL string
}

var cfg *Config

// Load reads .env once at startup. All other packages call Get().
func Load() {
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  No .env file found — reading from system environment")
	}

	jwtExpiry, _ := time.ParseDuration(getEnv("JWT_EXPIRY", "15m"))
	refreshExpiry, _ := time.ParseDuration(getEnv("REFRESH_TOKEN_EXPIRY", "168h"))

	cfg = &Config{
		AppPort:     getEnv("APP_PORT", "8080"),
		AppEnv:      getEnv("APP_ENV", "development"),
		DatabaseURL: mustGetEnv("DATABASE_URL"),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379"),

		JWTSecret:          mustGetEnv("JWT_SECRET"),
		JWTExpiry:          jwtExpiry,
		RefreshTokenExpiry: refreshExpiry,

		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:5173"),

		CloudinaryCloudName: getEnv("CLOUDINARY_CLOUD_NAME", ""),
		CloudinaryAPIKey:    getEnv("CLOUDINARY_API_KEY", ""),
		CloudinaryAPISecret: getEnv("CLOUDINARY_API_SECRET", ""),

		ResendAPIKey:     getEnv("RESEND_API_KEY", ""),
		EmailFrom:        getEnv("EMAIL_FROM", "no-reply@invenzo.in"),
		AdminFrontendURL: getEnv("ADMIN_FRONTEND_URL", "http://localhost:5173"),
	}

	log.Printf("✅ Config loaded | ENV=%s | PORT=%s", cfg.AppEnv, cfg.AppPort)
}

// Get returns the singleton config. Panics if Load() was not called.
func Get() *Config {
	if cfg == nil {
		log.Fatal("❌ Config not loaded — call config.Load() in main.go first")
	}
	return cfg
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func mustGetEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("❌ Required env var %q is not set", key)
	}
	return v
}
