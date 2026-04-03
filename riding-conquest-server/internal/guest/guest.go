package guest

import (
	"crypto/rand"
	"encoding/hex"
	"time"
)

// GenerateTempUserID 生成临时用户 ID（UUID 简化版）
func GenerateTempUserID() (string, error) {
	bytes := make([]byte, 16)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return "guest_" + hex.EncodeToString(bytes)[:16], nil
}

// TempUser 临时用户
type TempUser struct {
	ID        string    `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	ExpiresAt time.Time `json:"expires_at"` // 7 天后过期
	RideCount int       `json:"ride_count"`
}

// NewTempUser 创建临时用户
func NewTempUser(id string) *TempUser {
	now := time.Now()
	return &TempUser{
		ID:        id,
		CreatedAt: now,
		ExpiresAt: now.Add(7 * 24 * time.Hour), // 7 天有效期
		RideCount: 0,
	}
}

// IsExpired 检查是否过期
func (t *TempUser) IsExpired() bool {
	return time.Now().After(t.ExpiresAt)
}
