package main

import (
	"log"
	"net/http"

	"riding-conquest-server/internal/auth"
	"riding-conquest-server/internal/mock"
	"riding-conquest-server/pkg/database"

	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)

	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
	})

	db, err := database.Init()
	if err != nil {
		log.Printf("⚠️  DB: %v", err)
	} else {
		defer db.Close()
		log.Println("✅ DB connected")
	}

	// API v1
	v1 := r.Group("/api/v1")
	{
		// 健康检查
		v1.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		})
		
		// 认证路由
		v1.POST("/auth/login", auth.Login)
		v1.POST("/auth/refresh", auth.RefreshToken)
		v1.GET("/auth/me", auth.JWTAuthMiddleware(), auth.GetCurrentUser)
		
		// 模拟数据路由（开发专用）
		mockGroup := v1.Group("/mock")
		{
			mockGroup.POST("/generate", mock.GenerateData)
			mockGroup.POST("/quick-setup", mock.QuickSetup)
			mockGroup.GET("/user", mock.GenerateUser)
			mockGroup.GET("/leaderboard", mock.GenerateLeaderboard)
		}
	}

	log.Println("🚀 Server on :8080")
	log.Println("   GET  /api/v1/health")
	log.Println("   POST /api/v1/auth/login")
	log.Println("   POST /api/v1/auth/refresh")
	log.Println("   GET  /api/v1/auth/me")
	log.Println("   POST /api/v1/mock/generate")
	log.Println("   POST /api/v1/mock/quick-setup")
	log.Println("   GET  /api/v1/mock/user")
	log.Println("   GET  /api/v1/mock/leaderboard")
	
	r.Run(":8080")
}
