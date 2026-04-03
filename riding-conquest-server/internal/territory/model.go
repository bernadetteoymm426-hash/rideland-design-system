package territory

import "time"

// Territory 领土
type Territory struct {
	ID            int       `json:"id"`
	Name          string    `json:"name"`
	Province      string    `json:"province"`
	City          string    `json:"city"`
	Tier          string    `json:"tier"` // province/city/county
	TeamID        *int64    `json:"team_id"`
	TeamName      string    `json:"team_name"`
	DefenseValue  int       `json:"defense_value"`
	OccupiedAt    *time.Time `json:"occupied_at"`
	OccupiedWeek  *int      `json:"occupied_week"`
	PolygonData   []byte    `json:"-"` // PostGIS GEOMETRY
	CenterPoint   []byte    `json:"-"` // PostGIS POINT
	IsActive      bool      `json:"is_active"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// TerritoryListResponse 领土列表响应
type TerritoryListResponse struct {
	Territories []Territory `json:"territories"`
	Total       int         `json:"total"`
	MyTeamCount int         `json:"my_team_count"`
	AllyCount   int         `json:"ally_count"`
	EnemyCount  int         `json:"enemy_count"`
}

// TerritoryDetailResponse 领土详情响应
type TerritoryDetailResponse struct {
	Territory
	IsUnderAttack bool     `json:"is_under_attack"`
	AttackerTeam  *TeamInfo `json:"attacker_team,omitempty"`
	WarProgress   float64  `json:"war_progress"` // 攻城进度 0-100
}

// TeamInfo 战队信息（简化版）
type TeamInfo struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

// ListTerritoriesRequest 查询领土列表请求
type ListTerritoriesRequest struct {
	Province string `form:"province"`
	City     string `form:"city"`
	Tier     string `form:"tier"`
	TeamID   *int64 `form:"team_id"`
	Page     int    `form:"page"`
	PageSize int    `form:"page_size"`
}
