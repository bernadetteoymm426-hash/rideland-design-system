package mock

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type GenerateDataRequest struct {
	UserCount    int `json:"user_count" binding:"min=1,max=100"`
	TeamCount    int `json:"team_count" binding:"min=1,max=20"`
	RidesPerUser int `json:"rides_per_user" binding:"min=1,max=50"`
}

func GenerateData(c *gin.Context) {
	var req GenerateDataRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		req = GenerateDataRequest{
			UserCount:    10,
			TeamCount:    5,
			RidesPerUser: 5,
		}
	}

	users := GenerateUsers(req.UserCount)
	teams := GenerateTeams(req.TeamCount, users)
	rides := GenerateRides(req.UserCount, req.RidesPerUser, teams)
	warData := GenerateWarData(teams)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"users": users,
			"teams": teams,
			"rides": rides,
			"war":   warData,
		},
		"summary": gin.H{
			"user_count":  len(users),
			"team_count":  len(teams),
			"ride_count":  len(rides),
			"has_war":     warData != nil,
		},
		"message": "模拟数据生成成功",
	})
}

func QuickSetup(c *gin.Context) {
	users := GenerateUsers(20)
	teams := GenerateTeams(5, users)
	rides := GenerateRides(20, 10, teams)
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"users": users,
			"teams": teams,
			"rides": rides,
		},
		"summary": gin.H{
			"users":       len(users),
			"teams":       len(teams),
			"total_rides": len(rides),
			"avg_rides":   len(rides) / len(users),
		},
		"message": "快速测试环境已生成",
	})
}

func GenerateUser(c *gin.Context) {
	idStr := c.DefaultQuery("id", "1")
	id, _ := strconv.ParseInt(idStr, 10, 64)
	
	users := GenerateUsers(int(id + 1))
	if int(id) < len(users) {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    users[id],
		})
	} else {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "用户不存在",
		})
	}
}

func GenerateLeaderboard(c *gin.Context) {
	teams := GenerateTeams(10, GenerateUsers(50))
	
	type TeamRank struct {
		Rank          int     `json:"rank"`
		TeamID        int64   `json:"team_id"`
		TeamName      string  `json:"team_name"`
		MemberCount   int     `json:"member_count"`
		TotalDistance float64 `json:"total_distance"`
		AvgDistance   float64 `json:"avg_distance"`
	}
	
	ranks := make([]TeamRank, len(teams))
	for i, team := range teams {
		totalDist := float64(1000 + i*500)
		ranks[i] = TeamRank{
			Rank:          i + 1,
			TeamID:        team.ID,
			TeamName:      team.Name,
			MemberCount:   len(team.MemberIDs),
			TotalDistance: totalDist,
			AvgDistance:   totalDist / float64(len(team.MemberIDs)),
		}
	}
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"team_rank": ranks,
		},
	})
}
