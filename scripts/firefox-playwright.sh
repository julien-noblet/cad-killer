#!/usr/bin/env bash
# Wrapper for Playwright Firefox on NixOS
FF_BIN=$(find "$HOME/.cache/ms-playwright" -name "firefox" -type f -path "*/firefox/*" 2>/dev/null | head -n 1)
if [ -z "$FF_BIN" ] || [ ! -x "$FF_BIN" ]; then
  FF_BIN="/run/current-system/sw/bin/firefox"
fi

args=()
while [ $# -gt 0 ]; do
  case "$1" in
    -profile)
      shift
      profile_dir="$1"
      base=$(basename "$profile_dir")
      target_profile="$HOME/.cache/ms-playwright/profiles/$base"
      mkdir -p "$HOME/.cache/ms-playwright/profiles"
      rm -rf "$target_profile"
      cp -a "$profile_dir" "$target_profile" 2>/dev/null || mkdir -p "$target_profile"
      args+=("-profile" "$target_profile")
      ;;
    *)
      args+=("$1")
      ;;
  esac
  shift
done

export MOZ_NO_REMOTE=1
export DBUS_SESSION_BUS_ADDRESS=""

if command -v steam-run >/dev/null 2>&1; then
  exec steam-run "$FF_BIN" "${args[@]}"
else
  exec "$FF_BIN" "${args[@]}"
fi
