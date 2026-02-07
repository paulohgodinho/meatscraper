#!/bin/sh

# meatscraper Docker Entrypoint Script
# Handles both file mode and server mode

# If no arguments provided, default to server mode
if [ $# -eq 0 ]; then
  exec node dist/cli.js serve
fi

# If first argument is "serve", start server mode
if [ "$1" = "serve" ]; then
  exec node dist/cli.js serve
fi

# Otherwise treat as file path for file mode
exec node dist/cli.js "$@"
