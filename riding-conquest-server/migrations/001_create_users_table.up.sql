-- 创建 users 表
-- up

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    phone VARCHAR(11) NOT NULL UNIQUE,
    nickname VARCHAR(20) NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    home_district_id INTEGER DEFAULT NULL,
    team_id BIGINT DEFAULT NULL,
    role VARCHAR(20) DEFAULT 'member',
    status VARCHAR(20) DEFAULT 'active',
    jwt_token_hash VARCHAR(64) DEFAULT NULL,
    token_expires_at TIMESTAMP DEFAULT NULL,
    last_login_at TIMESTAMP DEFAULT NULL,
    last_active_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_nickname ON users(nickname);
CREATE INDEX idx_users_team_id ON users(team_id);
CREATE INDEX idx_users_status ON users(status);
