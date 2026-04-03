-- 创建 territories 表（启用 PostGIS）
-- up

-- 启用 PostGIS 扩展
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS territories (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    province VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    tier VARCHAR(10) DEFAULT 'county',
    team_id BIGINT DEFAULT NULL,
    defense_value INTEGER DEFAULT 1000,
    occupied_at TIMESTAMP DEFAULT NULL,
    occupied_week_num INTEGER DEFAULT NULL,
    polygon_data GEOMETRY(POLYGON, 4326) NOT NULL,
    center_point GEOMETRY(POINT, 4326) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_territories_team FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE INDEX idx_territories_team_id ON territories(team_id);
CREATE INDEX idx_territories_province ON territories(province);
CREATE INDEX idx_territories_city ON territories(city);
CREATE INDEX idx_territories_tier ON territories(tier);
CREATE INDEX idx_territories_active ON territories(is_active);

-- 创建空间索引
CREATE INDEX idx_territories_polygon ON territories USING GIST(polygon_data);
CREATE INDEX idx_territories_center ON territories USING GIST(center_point);
