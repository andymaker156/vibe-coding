#!/usr/bin/env bash
# Serve the repo locally and open the app shelf.
set -euo pipefail

PORT="${1:-8000}"
cd "$(dirname "$0")"

python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null || true' EXIT

sleep 1
echo "Serving on http://localhost:$PORT/apps/  (ctrl-c to stop)"
open "http://localhost:$PORT/apps/"
wait $SERVER_PID
