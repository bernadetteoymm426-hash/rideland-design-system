package territory

import (
	"net/http"
	"riding-conquest-server/internal/errors"

	"github.com/gin-gonic/gin"
)

// Handler 领土 handler
type Handler struct {
	// service *Service
}

// NewHandler 创建领土 handler
func NewHandler() *Handler {
	return &Handler{}
}

// ListTerritories 获取领土列表
func (h *Handler) ListTerritories(c *gin.Context) {
	var req ListTerritoriesRequest
	
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    errors.ErrInvalidRequest,
			"message": "Invalid request parameters",
		})
		return
	}
	
	// TODO: 从数据库查询领土列表
	// 这里返回模拟数据
	territories := []Territory{
		{
			ID:           110101,
			Name:         "东城区",
			Province:     "北京市",
			City:         "北京市",
			Tier:         "county",
			DefenseValue: 1000,
			IsActive:     true,
		},
		{
			ID:           310101,
			Name:         "黄浦区",
			Province:     "上海市",
			City:         "上海市",
			Tier:         "county",
			DefenseValue: 1000,
			IsActive:     true,
		},
	}
	
	c.JSON(http.StatusOK, TerritoryListResponse{
		Territories: territories,
		Total:       len(territories),
	})
}

// GetTerritoryDetail 获取领土详情
func (h *Handler) GetTerritoryDetail(c *gin.Context) {
	id := c.Param("id")
	
	// TODO: 从数据库查询领土详情
	// 这里返回模拟数据
	territory := Territory{
		ID:           110101,
		Name:         "东城区",
		Province:     "北京市",
		City:         "北京市",
		DefenseValue: 1000,
	}
	
	c.JSON(http.StatusOK, territory)
}

// GetCurrentTerritories 获取当前战队领土
func (h *Handler) GetCurrentTerritories(c *gin.Context) {
	userID, _ := c.Get("user_id")
	
	// TODO: 查询用户所在战队的领土
	_ = userID
	
	c.JSON(http.StatusOK, gin.H{
		"territories": []Territory{},
		"count":       0,
	})
}
