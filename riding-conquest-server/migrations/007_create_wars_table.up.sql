-- 创建 wars 表
-- up

CREATE TABLE IF NOT EXISTS wars (
    id BIGSERIAL PRIMARY KEY,
    attacker_team_id BIGINT NOT NULL,
    defender_team_id BIGINT NOT NULL,
    territory_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'declared',
    war_week_num INTEGER NOT NULL,
    war_year INTEGER NOT NULL,
    attack_total DECIMAL(10,2) DEFAULT 0,
    defense_total DECIMAL(10,2) DEFAULT 0,
    progress DECIMAL(5,2) DEFAULT 0,
    started_at TIMESTAMP DEFAULT NULL,
    ended_at TIMESTAMP DEFAULT NULL,
    settled_at TIMESTAMP DEFAULT NULL,
    winner_team_id BIGINT DEFAULT NULL,
    result_type VARCHAR(20) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_wars_attacker FOREIGN KEY (attacker_team_id) REFERENCES teams(id),
    CONSTRAINT fk_wars_defender FOREIGN KEY (defender_team_id) REFERENCES teams(id),
    CONSTRAINT fk_wars_territory FOREIGN KEY (territory_id) REFERENCES territories(id),
    CONSTRAINT fk_wars_winner FOREIGN KEY (winner_team_id) REFERENCES teams(id)
);

CREATE INDEX idx_wars_attacker ON wars(attacker_team_id);
CREATE INDEX idx_wars_defender ON wars(defender_team_id);
CREATE INDEX idx_wars_territory ON wars(territory_id);
CREATE INDEX idx_wars_status ON wars(status);
CREATE INDEX idx_wars_week ON wars(war_week_num, war_year);
