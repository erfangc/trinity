#!/bin/bash

# Set variables
OPENAPI_URL="http://localhost:8080/v3/api-docs"
OUTPUT_DIR="./generated-sdk"

# Resolve project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

# Set JAVA_HOME if not already set
if [ -z "$JAVA_HOME" ]; then
  export JAVA_HOME=$(/usr/libexec/java_home -v 23)
fi

# Ensure OpenAPI Generator CLI is installed
if ! command -v openapi-generator-cli &> /dev/null; then
  echo "OpenAPI Generator CLI is not installed. Installing now..."
  npm install -g @openapitools/openapi-generator-cli
fi

# Run OpenAPI Generator
echo "Generating SDK from $OPENAPI_URL to $OUTPUT_DIR..."
openapi-generator-cli generate \
  -i "$OPENAPI_URL" \
  -g typescript-axios \
  -o "$PROJECT_ROOT/$OUTPUT_DIR"

if [ $? -eq 0 ]; then
  echo "SDK successfully generated at $OUTPUT_DIR"
else
  echo "Failed to generate SDK"
  exit 1
fi