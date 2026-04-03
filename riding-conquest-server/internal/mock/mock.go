package mock

import (
	"fmt"
	"math/rand"
	"time"
)

var (
	cityNames = []string{"北京市", "上海市", "广州市", "深圳市", "杭州市"}
	districtNames = []string{"东城区", "西城区", "朝阳区", "海淀区", "丰台区"}
	teamNames = []string{"极速骑行团", "破风者联盟", "飞轮战队", "踏风者", "骑行者联盟", "旋风战队", "骑士团"}
	nicknames = []string{"骑行大神", "破风手", "飞轮侠", "踏风者", "骑行客", "车手 001", "车手 002", "车手 003"}
	routeNames = []string{"朝阳公园环线", "长安街往返", "奥林匹克森林公园", "怀柔水库往返", "颐和园环线"}
)

type MockUser struct {
	ID       int64  `json:"id"`
	Phone    string `json:"phone"`
	Nickname string `json:"nickname"`
	Avatar   string `json:"avatar"`
}

type MockTeam struct {
	ID        int64   `json:"id"`
	Name      string  `json:"name"`
	LeaderID  int64   `json:"leader_id"`
	MemberIDs []int64 `json:"member_ids"`
}

type MockRide struct {
	UserID       int64   `json:"user_id"`
	TeamID       int64   `json:"team_id"`
	Distance     float64 `json:"distance"`
	Duration     int     `json:"duration"`
	Calories     int     `json:"calories"`
	AvgSpeed     float64 `json:"avg_speed"`
	MaxSpeed     float64 `json:"max_speed"`
	RouteName    string  `json:"route_name"`
	Date         string  `json:"date"`
	Contribution int     `json:"contribution"`
}

func GenerateUsers(count int) []MockUser {
	users := make([]MockUser, count)
	for i := 0; i < count; i++ {
		users[i] = MockUser{
			ID:       int64(i + 1),
			Phone:    fmt.Sprintf("138%08d", i+1),
			Nickname: fmt.Sprintf("%s_%d", nicknames[rand.Intn(len(nicknames))], i+1),
			Avatar:   "",
		}
	}
	return users
}

func GenerateTeams(count int, users []MockUser) []MockTeam {
	teams := make([]MockTeam, count)
	for i := 0; i < count; i++ {
		leaderID := users[rand.Intn(len(users))].ID
		teams[i] = MockTeam{
			ID:        int64(i + 1),
			Name:      fmt.Sprintf("%s_%d 队", teamNames[rand.Intn(len(teamNames))], i+1),
			LeaderID:  leaderID,
			MemberIDs: []int64{leaderID},
		}
	}
	return teams
}

func GenerateRides(userCount int, ridesPerUser int, teams []MockTeam) []MockRide {
	rides := make([]MockRide, 0)
	rand.Seed(time.Now().UnixNano())
	
	for userID := 1; userID <= userCount; userID++ {
		teamID := int64(rand.Intn(len(teams)) + 1)
		
		for j := 0; j < ridesPerUser; j++ {
			distance := 15.0 + rand.Float64()*50.0
			duration := int(distance * 3.0)
			calories := int(distance * 25.0)
			avgSpeed := 18.0 + rand.Float64()*8.0
			maxSpeed := avgSpeed * 1.5
			contribution := int(distance*10 + float64(duration)*1)
			
			daysAgo := rand.Intn(30)
			date := time.Now().AddDate(0, 0, -daysAgo).Format("2006-01-02")
			
			rides = append(rides, MockRide{
				UserID:       int64(userID),
				TeamID:       teamID,
				Distance:     distance,
				Duration:     duration,
				Calories:     calories,
				AvgSpeed:     avgSpeed,
				MaxSpeed:     maxSpeed,
				RouteName:    routeNames[rand.Intn(len(routeNames))],
				Date:         date,
				Contribution: contribution,
			})
		}
	}
	return rides
}

func GenerateWarData(teams []MockTeam) map[string]interface{} {
	if len(teams) < 2 {
		return nil
	}
	
	attacker := teams[rand.Intn(len(teams))]
	defender := teams[rand.Intn(len(teams))]
	
	return map[string]interface{}{
		"attacker_team_id": attacker.ID,
		"defender_team_id": defender.ID,
		"territory_id":     rand.Intn(100) + 1,
		"attack_total":     float64(rand.Intn(5000) + 1000),
		"defense_total":    float64(rand.Intn(5000) + 1000),
		"status":           "active",
	}
}
