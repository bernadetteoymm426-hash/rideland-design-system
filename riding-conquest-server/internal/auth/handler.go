package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type LoginRequest struct {
	Phone    string `json:"phone" binding:"required,len=11"`
	Nickname string `json:"nickname" binding:"required,min=2,max=20"`
	Avatar   string `json:"avatar"`
}

type LoginResponse struct {
	Token     string `json:"token"`
	ExpiresIn int    `json:"expires_in"`
	UserID    int64  `json:"user_id"`
	Phone     string `json:"phone"`
	Nickname  string `json:"nickname"`
}

// Login 用户登录
func Login(c *gin.Context) {
	var req LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    1001,
			"message": "Invalid request parameters",
			"detail":  err.Error(),
		})
		return
	}

	// TODO: 验证顽鹿平台用户凭证
	// TODO: 如果用户不存在则自动创建
	userID := int64(1)

	token, err := GenerateToken(userID, req.Phone, req.Nickname)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    5000,
			"message": "Failed to generate token",
		})
		return
	}

	c.JSON(http.StatusOK, LoginResponse{
		Token:     token,
		ExpiresIn: 24 * 3600,
		UserID:    userID,
		Phone:     req.Phone,
		Nickname:  req.Nickname,
	})
}

// RefreshToken 刷新 token
func RefreshToken(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    4001,
			"message": "Missing authorization header",
		})
		return
	}

	tokenString := authHeader
	if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
		tokenString = authHeader[7:]
	}

	claims, err := ParseToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    4003,
			"message": "Invalid token",
		})
		return
	}

	newToken, _ := GenerateToken(claims.UserID, claims.Phone, claims.Nickname)

	c.JSON(http.StatusOK, gin.H{
		"token":      newToken,
		"expires_in": 24 * 3600,
	})
}

// GetCurrentUser 获取当前用户信息
func GetCurrentUser(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    4001,
			"message": "User not authenticated",
		})
		return
	}

	phone, _ := c.Get("phone")
	nickname, _ := c.Get("nickname")

	c.JSON(http.StatusOK, gin.H{
		"user_id":  userID,
		"phone":    phone,
		"nickname": nickname,
	})
}
