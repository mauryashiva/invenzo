// common/database/postgres.go
// Supabase PostgreSQL connection via GORM.
// Uses DATABASE_URL from config — change .env → connects to new DB automatically.
package database

import (
	"log"

	"github.com/mauryashiva/invenzo-backend/common/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// Connect initialises the GORM connection to Supabase PostgreSQL.
// Call this once in main.go before mounting routes.
func Connect() {
	cfg := config.Get()

	db, err := gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logLevel(cfg.AppEnv)),
	})
	if err != nil {
		log.Fatalf("❌ Database connection failed: %v", err)
	}

	// Connection pool tuning for Supabase free tier
	sqlDB, _ := db.DB()
	sqlDB.SetMaxOpenConns(10)
	sqlDB.SetMaxIdleConns(5)

	DB = db
	log.Println("✅ Connected to Supabase PostgreSQL")
}

// GetDB returns the active DB instance for use in repositories.
func GetDB() *gorm.DB {
	return DB
}

func logLevel(env string) logger.LogLevel {
	if env == "development" {
		return logger.Info
	}
	return logger.Error
}
