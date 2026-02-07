#!/bin/bash
set -e

IMAGE_NAME="meatscraper:test"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTAINER_ID=""
PORT=8676
PASSED=0
FAILED=0

cleanup() {
  if [ -n "$CONTAINER_ID" ]; then
    docker stop $CONTAINER_ID 2>/dev/null || true
    docker rm $CONTAINER_ID 2>/dev/null || true
  fi
}

trap cleanup EXIT

echo "Starting server mode container..."
CONTAINER_ID=$(docker run -d -p $PORT:$PORT $IMAGE_NAME serve)

# Wait for server to be ready
echo "Waiting for server to be ready..."
for i in {1..30}; do
  if curl -s http://localhost:$PORT/health >/dev/null 2>&1; then
    echo "Server is ready"
    break
  fi
  sleep 1
done

# Test POST /extract endpoint
echo "Testing POST /extract endpoint..."
TEST_HTML="<html><body><h1>Test Article</h1><p>This is test content for extraction.</p></body></html>"

RESPONSE=$(curl -s -X POST http://localhost:$PORT/extract \
  -H "Content-Type: application/json" \
  -d "{\"html\":\"$TEST_HTML\"}")

# Check if response is valid JSON
if echo "$RESPONSE" | jq empty 2>/dev/null; then
  echo "[PASS] Valid JSON response"
  ((PASSED++))
else
  echo "[FAIL] Response is not valid JSON"
  ((FAILED++))
fi

# Check for success field
if echo "$RESPONSE" | jq -e '.success' >/dev/null 2>&1; then
  echo "[PASS] Success field in response"
  ((PASSED++))
else
  echo "[FAIL] Success field missing from response"
  ((FAILED++))
fi

# Check for data.content field
if echo "$RESPONSE" | jq -e '.data.content' >/dev/null 2>&1; then
  echo "[PASS] Content extracted in response"
  ((PASSED++))
else
  echo "[FAIL] Content missing from response"
  ((FAILED++))
fi

# Check for data.metadata field
if echo "$RESPONSE" | jq -e '.data.metadata' >/dev/null 2>&1; then
  echo "[PASS] Metadata in response"
  ((PASSED++))
else
  echo "[FAIL] Metadata missing from response"
  ((FAILED++))
fi

echo ""
echo "Server mode: $PASSED passed, $FAILED failed"

if [ $FAILED -gt 0 ]; then
  exit 1
fi
exit 0
