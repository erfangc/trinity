#!/bin/bash

# Configuration
LOCAL_PUBLIC_DIR="./public"                                     # Path to the local public folder
REMOTE_USER="root"                                              # Remote server username
REMOTE_HOST="api.trinityprayer.org"                            # Remote server hostname or IP
REMOTE_DIR="/var/www/trinityprayer"                            # Directory where the files will be hosted

# Ensure the local public directory exists
if [ ! -d "$LOCAL_PUBLIC_DIR" ]; then
  echo "Error: Local public directory '$LOCAL_PUBLIC_DIR' does not exist."
  exit 1
fi

# Sync the local public directory to the remote server
echo "Deploying files to $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR..."
rsync -avz --delete "$LOCAL_PUBLIC_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"

# Check if the rsync command succeeded
if [ $? -eq 0 ]; then
  echo "Files successfully deployed to $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"
else
  echo "Error: Failed to deploy files."
  exit 1
fi