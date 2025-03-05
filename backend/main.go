package main

import (
	"log"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"backend/routes"
	"backend/config"
)

func main() {
	app := fiber.New()

	// Enable CORS for Gatsby frontend
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:8000", // Gatsby dev server
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowHeaders: "Content-Type, Authorization",
	}))

	// Connect Database
	config.ConnectDB()

	// Set up Routes
	routes.SetupRoutes(app)

	log.Fatal(app.Listen(":8080"))
}
