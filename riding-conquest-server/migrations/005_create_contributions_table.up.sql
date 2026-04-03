-- 创建 contributions 表
-- up

CREATE TABLE IF NOT EXISTS contributions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    ride_record_id BIGINT DEFAULT NULL,
    value DECIMAL(10,2) NOT NULL,
    source VARCHAR(50) DEFAULT 'ride',
    week_num INTEGER NOT NULL,
    year INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    settled_at TIMESTAMP DEFAULT NULL,
    note VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_contributions_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_contributions_team FOREIGN KEY (team_id) REFERENCES teams(id),
    CONSTRAINT fk_contributions_ride FOREIGN KEY (ride_record_id) REFERENCES ride_records(id)
);

CREATE INDEX idx_contributions_user_id ON contributions(user_id);
CREATE INDEX idx_contributions_team_id ON contributions(team_id);
CREATE INDEX idx_contributions_week ON contributions(week_num, year);
CREATE INDEX idx_contributions_status ON contributions(status);
