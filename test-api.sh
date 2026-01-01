#!/bin/bash

# Effortee API Testing Script
# Tests all endpoints to verify they're working

BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Testing Effortee API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1: Health Check
echo -e "\n${YELLOW}Test 1: Health Check${NC}"
curl -s "$BASE_URL/health" | jq '.'

# Test 2: Get All Users
echo -e "\n${YELLOW}Test 2: GET /v1/users/${NC}"
curl -s "$BASE_URL/v1/users/" | jq '.'

# Test 3: Create New Quest
echo -e "\n${YELLOW}Test 3: POST /v1/quest/ (Create Quest)${NC}"
QUEST_RESPONSE=$(curl -s -X POST "$BASE_URL/v1/quest/" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Quest from API",
    "description": "This is a test quest created via API",
    "subject": "Computer Science",
    "topic": "API Testing",
    "effort_type": "coding",
    "studied_minutes": 0,
    "suggested_minutes": 30,
    "deadline": "2025-03-01",
    "visibility": "shared",
    "status": "prepare"
  }')

echo "$QUEST_RESPONSE" | jq '.'

# Extract quest ID for further tests
QUEST_ID=$(echo "$QUEST_RESPONSE" | jq -r '.quest.id')
echo -e "${GREEN}Created Quest ID: $QUEST_ID${NC}"

# Test 4: Get All Quests
echo -e "\n${YELLOW}Test 4: GET /v1/quest/ (Get All Quests)${NC}"
curl -s "$BASE_URL/v1/quest/" | jq '.'

# Test 5: Get Single Quest
if [ ! -z "$QUEST_ID" ]; then
  echo -e "\n${YELLOW}Test 5: GET /v1/quest/$QUEST_ID (Get Single Quest)${NC}"
  curl -s "$BASE_URL/v1/quest/$QUEST_ID" | jq '.'
fi

# Test 6: Update Quest (PATCH)
if [ ! -z "$QUEST_ID" ]; then
  echo -e "\n${YELLOW}Test 6: PATCH /v1/quest/$QUEST_ID (Update Quest)${NC}"
  curl -s -X PATCH "$BASE_URL/v1/quest/$QUEST_ID" \
    -H "Content-Type: application/json" \
    -d '{
      "studied_minutes": 15,
      "status": "active"
    }' | jq '.'
fi

# Test 7: Get Quest Stats
echo -e "\n${YELLOW}Test 7: GET /v1/quest/stats (Quest Statistics)${NC}"
curl -s "$BASE_URL/v1/quest/stats" | jq '.'

# Test 8: Filter Quests by Status
echo -e "\n${YELLOW}Test 8: GET /v1/quest/?status=active (Filter by Status)${NC}"
curl -s "$BASE_URL/v1/quest/?status=active" | jq '.'

# Test 9: Filter Quests by Subject
echo -e "\n${YELLOW}Test 9: GET /v1/quest/?subject=Math (Filter by Subject)${NC}"
curl -s "$BASE_URL/v1/quest/?subject=Math" | jq '.'

# Test 10: Delete Quest
if [ ! -z "$QUEST_ID" ]; then
  echo -e "\n${YELLOW}Test 10: DELETE /v1/quest/$QUEST_ID (Delete Quest)${NC}"
  read -p "Delete the test quest? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    curl -s -X DELETE "$BASE_URL/v1/quest/$QUEST_ID" | jq '.'
    echo -e "${GREEN}Quest deleted${NC}"
  else
    echo -e "${YELLOW}Skipped deletion${NC}"
  fi
fi

# Test 11: Invalid Endpoint (404)
echo -e "\n${YELLOW}Test 11: GET /invalid/endpoint (404 Test)${NC}"
curl -s "$BASE_URL/invalid/endpoint" | jq '.'

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ All tests completed!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"