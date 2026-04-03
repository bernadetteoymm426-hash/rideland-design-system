-- 创建 teams 表
-- up

CREATE TABLE IF NOT EXISTS teams (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    leader_id BIGINT NOT NULL,
    level INTEGER DEFAULT 1,
    exp INTEGER DEFAULT 0,
    base_district_id INTEGER DEFAULT NULL,
    member_count INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'active',
    disbanded_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_teams_leader FOREIGN KEY (leader_id) REFERENCES users(id)
);

CREATE INDEX idx_teams_name ON teams(name);
CREATE INDEX idx_teams_leader_id ON teams(leader_id);
CREATE INDEX idx_teams_status ON teams(status);
