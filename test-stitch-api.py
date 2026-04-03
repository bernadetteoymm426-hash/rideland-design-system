#!/usr/bin/env python3
"""
Test Stitch API connection
"""
import requests
import json

import os
API_KEY = os.environ.get("STITCH_API_KEY", "YOUR_STITCH_API_KEY_HERE")  # 请设置环境变量 STITCH_API_KEY
BASE_URL = "https://stitch.googleapis.com/v1"

headers = {
    "X-Goog-Api-Key": API_KEY,
    "Content-Type": "application/json"
}

print("🔍 Testing Stitch API connection...")
print("=" * 60)

# Test 1: List projects
print("\n📁 Listing projects...")
try:
    response = requests.get(
        f"{BASE_URL}/projects",
        headers=headers,
        timeout=30
    )
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        projects = response.json()
        print(f"✅ Found {len(projects.get('projects', []))} projects")
        for project in projects.get('projects', []):
            print(f"  - {project.get('id')}: {project.get('displayName', 'No name')}")
    else:
        print(f"❌ Error: {response.text}")
except Exception as e:
    print(f"❌ Request failed: {e}")

# Test 2: Get project details (if exists)
print("\n🔍 Trying to access 'rideland-ux-design' project...")
try:
    response = requests.get(
        f"{BASE_URL}/projects/rideland-ux-design",
        headers=headers,
        timeout=30
    )
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        project = response.json()
        print(f"✅ Project found: {project.get('displayName', 'No name')}")
    else:
        print(f"❌ Project not found or error: {response.status_code}")
except Exception as e:
    print(f"❌ Request failed: {e}")

print("\n" + "=" * 60)
print("Test complete!")
