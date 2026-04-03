-- 创建 ride_records 表
-- up

CREATE TABLE IF NOT EXISTS ride_records (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    team_id BIGINT DEFAULT NULL,
    distance DECIMAL(10,2) NOT NULL,
    duration INTEGER NOT NULL,
    calories INTEGER DEFAULT 0,
    avg_speed DECIMAL(5,2) DEFAULT 0,
    max_speed DECIMAL(5,2) DEFAULT 0,
    elevation_gain DECIMAL(8,2) DEFAULT 0,
    track_data JSONB DEFAULT NULL,
    start_point JSONB DEFAULT NULL,
    end_point JSONB DEFAULT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'completed',
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_reason VARCHAR(255) DEFAULT NULL,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP DEFAULT NULL,
    verified_by BIGINT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ride_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_ride_team FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE INDEX idx_ride_records_user_id ON ride_records(user_id);
CREATE INDEX idx_ride_records_team_id ON ride_records(team_id);
CREATE INDEX idx_ride_records_start_time ON ride_records(start_time);
CREATE INDEX idx_ride_records_status ON ride_records(status);
CREATE INDEX idx_ride_records_flagged ON ride_records(is_flagged);
