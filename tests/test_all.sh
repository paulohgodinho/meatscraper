#!/bin/bash
set -e

IMAGE_NAME="meatscraper:test"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Building Docker image: $IMAGE_NAME"
docker build -f "$SCRIPT_DIR/../docker/Dockerfile" -t $IMAGE_NAME "$SCRIPT_DIR/.."

echo ""
echo "Running file mode tests..."
bash "$SCRIPT_DIR/test_file.sh"
FILE_RESULT=$?

echo ""
echo "Running server mode tests..."
bash "$SCRIPT_DIR/test_server.sh"
SERVER_RESULT=$?

echo ""
if [ $FILE_RESULT -eq 0 ] && [ $SERVER_RESULT -eq 0 ]; then
  echo "All tests PASSED"
  exit 0
else
  echo "Some tests FAILED"
  exit 1
fi
