#!/bin/bash
set -e

IMAGE_NAME="meatscraper:test"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_FILE="$SCRIPT_DIR/test-article.html"
PASSED=0
FAILED=0

echo "Testing file mode with: $TEST_FILE"
OUTPUT=$(docker run --rm -v "$TEST_FILE:/input.html" $IMAGE_NAME /input.html 2>&1 | grep -A 10000 "^{")

# Check if output is valid JSON
if echo "$OUTPUT" | jq empty 2>/dev/null; then
  echo "[PASS] Valid JSON output"
  ((PASSED++))
else
  echo "[FAIL] Output is not valid JSON"
  ((FAILED++))
fi

# Check for success field
if echo "$OUTPUT" | jq -e '.success' >/dev/null 2>&1; then
  echo "[PASS] Success field present"
  ((PASSED++))
else
  echo "[FAIL] Success field missing"
  ((FAILED++))
fi

# Check for data.content field
if echo "$OUTPUT" | jq -e '.data.content' >/dev/null 2>&1; then
  echo "[PASS] Content extracted"
  ((PASSED++))
else
  echo "[FAIL] Content missing"
  ((FAILED++))
fi

# Check for data.image field
if echo "$OUTPUT" | jq -e '.data.image' >/dev/null 2>&1; then
  echo "[PASS] Image field present"
  ((PASSED++))
else
  echo "[FAIL] Image field missing"
  ((FAILED++))
fi

# Check for data.metadata field
if echo "$OUTPUT" | jq -e '.data.metadata' >/dev/null 2>&1; then
  echo "[PASS] Metadata field present"
  ((PASSED++))
else
  echo "[FAIL] Metadata field missing"
  ((FAILED++))
fi

echo ""
echo "File mode: $PASSED passed, $FAILED failed"

if [ $FAILED -gt 0 ]; then
  exit 1
fi
exit 0
