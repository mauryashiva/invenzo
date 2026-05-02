package main

import (
	"log"

	"github.com/mauryashiva/invenzo-backend/common/config"
	"github.com/mauryashiva/invenzo-backend/common/database"
	"github.com/mauryashiva/invenzo-backend/internal/domain"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// 1. Load config and DB
	config.Load()
	database.Connect()
	db := database.GetDB()

	// 2. Define the Super Admin
	email := "qyverion@gmail.com"
	password := "InvenzoAdmin123!" // You can change this later in the UI
	name := "Shiva Maurya"

	// 3. Hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("❌ Failed to hash password: %v", err)
	}

	// 4. Create the admin record
	admin := domain.Admin{
		Name:         name,
		Email:        email,
		PasswordHash: string(hash),
		Role:         "super_admin",
		IsActive:     true, // Important: must be true to login
	}

	// 5. Insert into Database
	if err := db.Create(&admin).Error; err != nil {
		log.Fatalf("❌ Failed to create super admin (maybe it already exists?): %v", err)
	}

	log.Println("✅ ──────────────────────────────────────────────────────────")
	log.Println("✅ SUPER ADMIN CREATED SUCCESSFULLY")
	log.Printf("✅ Email: %s\n", email)
	log.Printf("✅ Password: %s\n", password)
	log.Println("✅ ──────────────────────────────────────────────────────────")
}
