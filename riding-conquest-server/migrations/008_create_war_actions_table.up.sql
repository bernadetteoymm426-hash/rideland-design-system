-- 创建 war_actions 表
-- up

CREATE TABLE IF NOT EXISTS war_actions (
    id BIGSERIAL PRIMARY KEY,
    war_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    action_type VARCHAR(20) NOT NULL,
    ride_record_id BIGINT DEFAULT NULL,
    contribution DECIMAL(10,2) NOT NULL,
    stamina_cost INTEGER DEFAULT 0,
    is_validated BOOLEAN DEFAULT FALSE,
    validated_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_actions_war FOREIGN KEY (war_id) REFERENCES wars(id),
    CONSTRAINT fk_actions_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_actions_team FOREIGN KEY (team_id) REFERENCES teams(id),
    CONSTRAINT fk_actions_ride FOREIGN KEY (ride_record_id) REFERENCES ride_records(id)
);

CREATE INDEX idx_war_actions_war_id ON war_actions(war_id);
CREATE INDEX idx_war_actions_user_id ON war_actions(user_id);
CREATE INDEX idx_war_actions_team_id ON war_actions(team_id);
CREATE INDEX idx_war_actions_type ON war_actions(action_type);
CREATE INDEX idx_war_actions_created ON war_actions(created_at);
