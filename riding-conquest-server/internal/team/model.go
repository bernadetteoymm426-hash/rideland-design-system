package team

import "time"

// Team 战队
type Team struct {
	ID             int64     `json:"id"`
	Name           string    `json:"name"`
	LeaderID       int64     `json:"leader_id"`
	Level          int       `json:"level"`
	Exp            int       `json:"exp"`
	BaseDistrictID int       `json:"base_district_id"`
	MemberCount    int       `json:"member_count"`
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// TeamMember 战队成员
type TeamMember struct {
	ID          int64     `json:"id"`
	TeamID      int64     `json:"team_id"`
	UserID      int64     `json:"user_id"`
	Role        string    `json:"role"` // member/captain/co_captain
	JoinType    string    `json:"join_type"` // apply/invite
	Status      string    `json:"status"` // active/pending/left/kicked
	JoinedAt    time.Time `json:"joined_at"`
	CooldownUntil *time.Time `json:"cooldown_until"`
}

// CreateTeamRequest 创建战队请求
type CreateTeamRequest struct {
	Name     string `json:"name" binding:"required,min=2,max=20"`
	BaseDistrictID int `json:"base_district_id"`
}

// JoinTeamRequest 加入战队请求
type JoinTeamRequest struct {
	TeamID int64 `json:"team_id" binding:"required"`
}
