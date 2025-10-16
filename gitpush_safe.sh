#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Auto Git Commit & Push (Safe Mode)"
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")

# 1) Tambah semua perubahan
git add -A || true

# 2) Commit automatik
git commit -m "autopatch: sync latest build & gradle fixes" || echo "ℹ️ Tiada perubahan baru untuk commit"

# 3) Pastikan remote wujud
if ! git remote | grep -q origin; then
  echo "⚠️ Tiada remote 'origin'. Masukkan manual: git remote add origin <URL_GITHUB>"
else
  # 4) Push dengan retry 3 kali
  for i in {1..3}; do
    if git push origin "$BRANCH"; then
      echo "✅ Git push berjaya ke branch $BRANCH"
      exit 0
    else
      echo "⏳ Percubaan $i gagal, retry..."
      sleep 5
    fi
  done
  echo "❌ Gagal push selepas 3 percubaan."
fi
