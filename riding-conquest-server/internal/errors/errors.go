package errors

// 错误码分段规则：
// 1xxx - 通用错误
// 2xxx - 用户/认证相关
// 3xxx - 战队相关
// 4xxx - 骑行/贡献相关
// 5xxx - 攻防/战斗相关
// 6xxx - 地图/领土相关
// 7xxx - 周期/结算相关
// 8xxx - 通知/推送相关

// ErrorCode 业务错误码
type ErrorCode int

const (
	// 通用错误 1xxx
	ErrUnknown ErrorCode = 1000 + iota
	ErrInvalidRequest
	ErrUnauthorized
	ErrForbidden
	ErrNotFound
	ErrInternalServer

	// 用户/认证错误 2xxx
	ErrUserNotFound ErrorCode = 2000 + iota
	ErrUserAlreadyExists
	ErrInvalidCredentials
	ErrTokenExpired
	ErrTokenInvalid

	// 战队错误 3xxx
	ErrTeamNotFound ErrorCode = 3000 + iota
	ErrTeamAlreadyExists
	ErrTeamMemberNotFound
	ErrTeamMemberAlreadyExists
	ErrTeamFull
	ErrNotTeamCaptain
	ErrTeamCooldown

	// 骑行/贡献错误 4xxx
	ErrRideNotFound ErrorCode = 4000 + iota
	ErrInvalidRideData
	ErrRideSpeedExceeded
	ErrRideDurationTooShort
	ErrRideDistanceExceeded
	ErrContributionInvalid

	// 攻防/战斗错误 5xxx
	ErrWarNotFound ErrorCode = 5000 + iota
	ErrWarAlreadyExists
	ErrWarNotStarted
	ErrWarEnded
	ErrInvalidWarAction
	ErrInsufficientStamina

	// 地图/领土错误 6xxx
	ErrTerritoryNotFound ErrorCode = 6000 + iota
	ErrTerritoryOccupied
	ErrTerritoryUnderAttack
	ErrInvalidTerritoryAction

	// 周期/结算错误 7xxx
	ErrCycleNotFound ErrorCode = 7000 + iota
	ErrCycleNotEnded
	ErrSettlementFailed

	// 通知/推送错误 8xxx
	ErrNotificationFailed ErrorCode = 8000 + iota
	ErrPushServiceUnavailable
)

// APIError API 错误响应结构
type APIError struct {
	Code    ErrorCode `json:"code"`
	Message string    `json:"message"`
	Detail  string    `json:"detail,omitempty"` // 仅非生产环境
}

// NewAPIError 创建 API 错误
func NewAPIError(code ErrorCode, message string, detail ...string) *APIError {
	err := &APIError{
		Code:    code,
		Message: message,
	}
	if len(detail) > 0 {
		err.Detail = detail[0]
	}
	return err
}
