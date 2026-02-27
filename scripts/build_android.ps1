$currentDir = Get-Location
Write-Host ">>> Starting Android Build Process in $currentDir" -ForegroundColor Cyan

# 1. Navigate to Frontend
Set-Location frontend
Write-Host ">>> Navigated to Frontend Directory"

# 2. Build Web Assets
Write-Host ">>> Building Vite/React App..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "React Build Failed!"
    Set-Location $currentDir
    exit 1
}

# 3. Sync Capacitor
Write-Host ">>> Syncing Capacitor with Android..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Error "Capacitor Sync Failed!"
    Set-Location $currentDir
    exit 1
}

# 4. Check for Android Studio / Gradle
Write-Host ">>> Checking for Gradle Wrapper..."
Set-Location android
if (Test-Path ".\gradlew.bat") {
    Write-Host ">>> Building Android Bundle (Release)..." -ForegroundColor Yellow
    # Note: This will generate an unsigned debug build if no signing config is present, 
    # or fail if signing config is missing for 'release' build type.
    # We'll default to 'assembleDebug' for safety unless user has set up key.properties
    
    if (Test-Path ".\key.properties") {
         .\gradlew.bat bundleRelease
    } else {
         Write-Host "!!! No key.properties found. Building Debug APK instead." -ForegroundColor Magenta
         .\gradlew.bat assembleDebug
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ">>> Build Successful!" -ForegroundColor Green
        if (Test-Path ".\key.properties") {
             Write-Host "Artifact: frontend\android\app\build\outputs\bundle\release\app-release.aab"
        } else {
             Write-Host "Artifact: frontend\android\app\build\outputs\apk\debug\app-debug.apk"
        }
    } else {
        Write-Error "Gradle Build Failed."
    }
} else {
    Write-Warning "Gradle wrapper not found. Please open 'frontend/android' in Android Studio to build."
}

Set-Location $currentDir
Write-Host ">>> Done."
