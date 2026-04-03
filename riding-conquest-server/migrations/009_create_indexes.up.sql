-- 创建额外索引
-- up

-- users 表索引
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active_at);
CREATE INDEX IF NOT EXISTS idx_users_home_district ON users(home_district_id);

-- teams 表索引
CREATE INDEX IF NOT EXISTS idx_teams_level ON teams(level);
CREATE INDEX IF NOT EXISTS idx_teams_exp ON teams(exp);
CREATE INDEX IF NOT EXISTS idx_teams_member_count ON teams(member_count);

-- team_members 表索引
CREATE INDEX IF NOT EXISTS idx_team_members_joined ON team_members(joined_at);
CREATE INDEX IF NOT EXISTS idx_team_members_cooldown ON team_members(cooldown_until);

-- ride_records 表索引
CREATE INDEX IF NOT EXISTS idx_ride_user_time ON ride_records(user_id, start_time);
CREATE INDEX IF NOT EXISTS idx_ride_team_time ON ride_records(team_id, start_time);
CREATE INDEX IF NOT EXISTS idx_ride_records_avg_speed ON ride_records(avg_speed);

-- contributions 表索引
CREATE INDEX IF NOT EXISTS idx_contributions_team_week ON contributions(team_id, week_num, year);
CREATE INDEX IF NOT EXISTS idx_contributions_source ON contributions(source);

-- territories 表索引
CREATE INDEX IF NOT EXISTS idx_territories_name ON territories(name);
CREATE INDEX IF NOT EXISTS idx_territories_occupied ON territories(occupied_at);

-- wars 表索引
CREATE INDEX IF NOT EXISTS idx_wars_week_status ON wars(war_week_num, war_year, status);
CREATE INDEX IF NOT EXISTS idx_wars_created ON wars(created_at);

-- war_actions 表索引
CREATE INDEX IF NOT EXISTS idx_war_actions_user_war ON war_actions(user_id, war_id);
CREATE INDEX IF NOT EXISTS idx_war_actions_contribution ON war_actions(contribution);
