#!/bin/bash

ssh root@api.trinityprayer.org << 'EOF'
set -e

echo "📦 Navigating to project directory..."
cd /root/trinity/trinity-prayer-server

echo "🔄 Pulling latest code..."
git pull --rebase --prune

echo "⚙️ Building project..."
./mvnw package -DskipTests=true

echo "🚀 Restarting service..."
systemctl restart trinity-prayer || systemctl start trinity-prayer

echo "📄 Tailing logs (showing last 30 lines)..."
journalctl -u trinity-prayer -n 30 --no-pager
EOF