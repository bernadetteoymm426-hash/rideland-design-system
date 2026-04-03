package ride

import "time"

// RideRecord 骑行记录
type RideRecord struct {
	ID            int64       `json:"id"`
	UserID        int64       `json:"user_id"`
	TeamID        int64       `json:"team_id"`
	Distance      float64     `json:"distance"` // km
	Duration      int         `json:"duration"` // minutes
	Calories      int         `json:"calories"`
	AvgSpeed      float64     `json:"avg_speed"` // km/h
	MaxSpeed      float64     `json:"max_speed"`
	ElevationGain float64     `json:"elevation_gain"`
	TrackData     interface{} `json:"track_data"` // JSONB
	StartPoint    interface{} `json:"start_point"`
	EndPoint      interface{} `json:"end_point"`
	StartTime     time.Time   `json:"start_time"`
	EndTime       time.Time   `json:"end_time"`
	Status        string      `json:"status"`
	IsFlagged     bool        `json:"is_flagged"`
	FlagReason    string      `json:"flag_reason"`
	CreatedAt     time.Time   `json:"created_at"`
}

// CreateRideRequest 创建骑行记录请求
type CreateRideRequest struct {
	Distance      float64     `json:"distance" binding:"required"`
	Duration      int         `json:"duration" binding:"required"`
	Calories      int         `json:"calories"`
	AvgSpeed      float64     `json:"avg_speed"`
	MaxSpeed      float64     `json:"max_speed"`
	TrackData     interface{} `json:"track_data"`
	StartPoint    interface{} `json:"start_point"`
	EndPoint      interface{} `json:"end_point"`
	StartTime     time.Time   `json:"start_time" binding:"required"`
	EndTime       time.Time   `json:"end_time" binding:"required"`
}

// Validate 验证骑行数据（反作弊）
func (r *CreateRideRequest) Validate() error {
	// 速度超过 60km/h 标记为异常
	if r.AvgSpeed > 60 {
		return &ValidationError{Reason: "speed_exceeded"}
	}
	// 骑行时长低于 5 分钟不计入
	if r.Duration < 5 {
		return &ValidationError{Reason: "duration_too_short"}
	}
	// 单日超过 300km 标记为异常
	if r.Distance > 300 {
		return &ValidationError{Reason: "distance_exceeded"}
	}
	return nil
}

// ValidationError 验证错误
type ValidationError struct {
	Reason string
}

func (e *ValidationError) Error() string {
	return "validation failed: " + e.Reason
}
