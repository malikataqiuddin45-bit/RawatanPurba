#!/usr/bin/env bash
set -euo pipefail

log(){ printf "\n\033[1;36m== %s ==\033[0m\n" "$*"; }

# 0) Root projek
if [ ! -f package.json ]; then
  [ -d RawatanPurba ] && cd RawatanPurba || { echo "❌ package.json tak jumpa. cd ke root projek dulu."; exit 1; }
fi

# 1) Ensure icons (elak prebuild error)
mkdir -p assets
[ -f assets/icon.png ] || curl -sL -o assets/icon.png https://cdn.jsdelivr.net/gh/expo/expo@main/templates/expo-template-bare-minimum/assets/icon.png
[ -f assets/adaptive-icon.png ] || curl -sL -o assets/adaptive-icon.png https://cdn.jsdelivr.net/gh/expo/expo@main/templates/expo-template-bare-minimum/assets/adaptive-icon.png

# 2) Prebuild android (root)
log "Expo prebuild (android)"
rm -rf android/.gradle android/build android/app/build || true
npx expo prebuild --platform android --clean --non-interactive

# 3) Patch Gradle output (force path standard)
log "Patch Gradle outputDir to standard"
APP_ID=$(node -e "try{const p=require('./app.json');process.stdout.write(p.expo?.android?.package||'');}catch(e){process.stdout.write('');}")
[ -z "$APP_ID" ] && APP_ID="com.example.app"

cd android
# backups
cp -n app/build.gradle app/build.gradle.bak_$(date +%Y%m%d_%H%M%S) || true
cp -n build.gradle build.gradle.bak_$(date +%Y%m%d_%H%M%S) || true
cp -n settings.gradle settings.gradle.bak_$(date +%Y%m%d_%H%M%S) || true

# ensure include(':app') & repos
grep -q "include(':app')" settings.gradle || echo "include(':app')" >> settings.gradle
grep -q "google()" build.gradle || echo -e "\nallprojects { repositories { google(); mavenCentral() } }" >> build.gradle

# ensure namespace & outputDir block
if ! grep -q "applicationVariants.all" app/build.gradle; then
  cat >> app/build.gradle <<'EOF'

android.applicationVariants.all { variant ->
  variant.outputs.all { output ->
    if (variant.buildType.name == "debug") {
      output.outputFileName = "app-debug.apk"
      outputDir = new File("$rootDir/app/build/outputs/apk/debug")
    } else if (variant.buildType.name == "release") {
      output.outputFileName = "app-release.apk"
      outputDir = new File("$rootDir/app/build/outputs/apk/release")
    }
  }
}
EOF
fi

# if namespace missing, add it
grep -q "namespace" app/build.gradle || sed -i "0,/android {/s//android {\n  namespace \"$APP_ID\"/" app/build.gradle

cd ..

# 4) Build Debug APK
log "Gradle assembleDebug"
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
cd android
chmod +x gradlew || true
./gradlew clean
./gradlew assembleDebug --no-daemon --stacktrace
cd ..

# 5) Collect artifact (README layout)
log "Collect artifact"
mkdir -p builds/android
APK=$(find android/app/build/outputs/apk/debug -name "app-debug.apk" -maxdepth 1 -type f | head -n 1 || true)
if [ -z "$APK" ]; then
  # fallback cari apa-apa *.apk
  APK=$(find android/app/build/outputs -type f -name "*.apk" | head -n 1 || true)
fi
if [ -n "$APK" ]; then
  cp "$APK" builds/android/app-preview.apk
  echo "✅ APK: builds/android/app-preview.apk"
else
  echo "❌ Tiada debug APK dijumpai. Semak log."
  exit 1
fi

# 6) Auto commit + push (tak fail kalau tiada remote)
log "Git commit & push"
git add -A || true
git commit -m "build: prebuild + gradle patch + debug APK artifact" || true
git rev-parse --abbrev-ref HEAD >/dev/null 2>&1 && git push || true

log "Selesai"
