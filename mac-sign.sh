#!/bin/bash

set -e

APP_DIR="src-tauri/target/universal-apple-darwin/release/bundle/macos"
APP_NAME="easyjson"
APP_PATH="$APP_DIR/$APP_NAME.app"
ENTITLEMENTS="src-tauri/Entitlements.plist"

# Mode: dev | prod  (default: dev). Can pass as SIGN_MODE env or first arg.
MODE="${SIGN_MODE:-${1:-dev}}"

pick_identity() {
  local mode="$1"
  local identities
  identities=$(security find-identity -v -p codesigning 2>/dev/null || true)

  # If user explicitly set identity, respect it
  if [ -n "$MAC_CODESIGN_IDENTITY" ]; then
    echo "$MAC_CODESIGN_IDENTITY"
    return 0
  fi

  if [ "$mode" = "dev" ]; then
    # Prefer Apple Development for dev
    echo "$identities" | grep -E '"Apple Development: ' | head -n1 | sed -E 's/.*"(.*)"/\1/'
    return 0
  fi

  if [ "$mode" = "prod" ]; then
    # Prefer Developer ID Application for outside-App-Store, fallback to Apple Distribution
    local cand
    cand=$(echo "$identities" | grep -E '"Developer ID Application: ' | head -n1 | sed -E 's/.*"(.*)"/\1/')
    if [ -n "$cand" ]; then
      echo "$cand"
      return 0
    fi
    echo "$identities" | grep -E '"Apple Distribution: ' | head -n1 | sed -E 's/.*"(.*)"/\1/'
    return 0
  fi

  # Unknown mode -> empty
  echo ""
}

IDENTITY="$(pick_identity "$MODE")"
TEAM_ID="$(echo "$IDENTITY" | awk -F'[()]' '{print $2}')"
echo "$TEAM_ID"

if [ -z "$IDENTITY" ]; then
  echo "No suitable signing identity found for mode: $MODE"
  echo "Tip: set SIGN_MODE=dev|prod or MAC_CODESIGN_IDENTITY to override."
  echo "Available identities:"
  security find-identity -v -p codesigning || true
  exit 1
fi

codesign --force --deep --options runtime \
  --entitlements "$ENTITLEMENTS" \
  -s "$TEAM_ID" \
  "$APP_PATH"

xcrun productbuild --sign "$TEAM_ID" --component "$APP_PATH" /Applications "$APP_DIR/$APP_NAME.pkg"
