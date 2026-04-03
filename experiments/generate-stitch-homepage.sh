#!/bin/bash

# RideLand Homepage Generator for Stitch
# This script calls Stitch API to generate a homepage

API_KEY="${STITCH_API_KEY:-YOUR_STITCH_API_KEY_HERE}"  # 请设置环境变量 STITCH_API_KEY
PROJECT_ID="5180537362465701192"

PROMPT="Create a landscape game homepage (1920x1080) for \"Rideland\" (骑迹大陆) cycling conquest game using the Rideland Tactical design system.

Layout:
1. Top bar 80px: Logo \"骑迹大陆\" + Weekly status \"⚔️ 对战期 · 剩余 3 天 14 小时\"
2. Map area 85%: China map with territory overlays (green #10B981 45%, red #EF4444 35%, orange #F59E0B 40%, gray #6B7280 20%)
3. Floating navigation: Bottom center 40px, 4 buttons 80x80px (战队/作战/战报/排行), active state on 作战 with blue glow
4. User avatar: Top-right 64px with rotating gold ring

Style: Deep space black #070E1B background, tech blue #3B82F6 primary, backdrop blur 20px, strong glow effects, tactical command center aesthetic, game UI not app UI"

echo "🎨 Generating homepage in Stitch..."
echo "Project: $PROJECT_ID"
echo ""

curl -X POST "https://stitch.googleapis.com/v1/projects/$PROJECT_ID/screens:generateFromText" \
  -H "X-Goog-Api-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"prompt\": \"$PROMPT\",
    \"model_id\": \"GEMINI_2_5_FLASH\"
  }" 2>&1 | python3 -m json.tool

echo ""
echo "✅ Request sent! Check your Stitch project:"
echo "https://stitch.withgoogle.com/projects/$PROJECT_ID"
