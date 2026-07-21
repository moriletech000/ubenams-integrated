# PowerShell Script to Push Files to GitHub
# This script will push all files EXCEPT .md, .bat, and .txt files

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  UBENAMS GitHub Push Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$repoUrl = "https://github.com/joyboyyyy619/Ubenams_integrated.git"
$branch = "main"
$commitMessage = "Update website: HTML, CSS, JS, and backend files"

# Get current directory
$currentDir = Get-Location

Write-Host "Current directory: $currentDir" -ForegroundColor Yellow
Write-Host ""

# Check if git is installed
Write-Host "Checking Git installation..." -ForegroundColor Green
$gitInstalled = $false
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Git found: $gitVersion" -ForegroundColor Green
        $gitInstalled = $true
    }
}
catch {
    Write-Host "[ERROR] Git is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not $gitInstalled) {
    Write-Host "[ERROR] Git is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if .git exists
if (Test-Path ".git") {
    Write-Host "[OK] Git repository found" -ForegroundColor Green
    Write-Host ""
    
    # Fetch latest changes
    Write-Host "Fetching latest changes from remote..." -ForegroundColor Yellow
    git fetch origin
}
else {
    Write-Host "[OK] Initializing new Git repository..." -ForegroundColor Green
    git init
    Write-Host ""
    
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin $repoUrl
}

Write-Host ""

# Create/Update .gitignore to exclude .md, .bat, .txt files
Write-Host "Creating .gitignore for excluded files..." -ForegroundColor Yellow

$gitignoreLines = @(
    "# Documentation and Script Files (excluded from repo)"
    "*.md"
    "*.bat"
    "*.txt"
    ""
    "# Environment Files"
    ".env"
    "backend/.env"
    ""
    "# Operating System Files"
    ".DS_Store"
    ".DS_Store?"
    "._*"
    ".Spotlight-V100"
    ".Trashes"
    "ehthumbs.db"
    "Thumbs.db"
    "Desktop.ini"
    ""
    "# Editor Files"
    ".vscode/"
    ".idea/"
    "*.swp"
    "*.swo"
    "*~"
    ""
    "# Node Modules"
    "node_modules/"
    "npm-debug.log"
    "yarn-error.log"
    ""
    "# Logs"
    "*.log"
    "logs/"
    ""
    "# Temporary Files"
    "*.tmp"
    "*.temp"
    "temp/"
    "tmp/"
)

$gitignoreLines | Out-File -FilePath ".gitignore" -Encoding UTF8 -Force
Write-Host "[OK] .gitignore created" -ForegroundColor Green
Write-Host ""

# Remove files that should not be tracked
Write-Host "Removing excluded file types from tracking..." -ForegroundColor Yellow
git rm --cached -r *.md 2>&1 | Out-Null
git rm --cached -r *.bat 2>&1 | Out-Null
git rm --cached -r *.txt 2>&1 | Out-Null
git rm --cached backend/.env 2>&1 | Out-Null
Write-Host "[OK] Excluded files removed from tracking" -ForegroundColor Green
Write-Host ""

# Stage all files (respecting .gitignore)
Write-Host "Staging files for commit..." -ForegroundColor Yellow
git add .
Write-Host "[OK] Files staged" -ForegroundColor Green
Write-Host ""

# Show what will be committed
Write-Host "Files to be committed:" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan
git status --short
Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host ""

# Ask for confirmation
$confirm = Read-Host "Do you want to proceed with the commit and push? (yes/no)"

if ($confirm -ne "yes" -and $confirm -ne "y") {
    Write-Host "Operation cancelled by user." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 0
}

Write-Host ""

# Commit changes
Write-Host "Creating commit..." -ForegroundColor Yellow
git commit -m $commitMessage 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Commit created successfully" -ForegroundColor Green
}
else {
    Write-Host "[OK] No changes to commit (all files up to date)" -ForegroundColor Yellow
}

Write-Host ""

# Pull latest changes first (in case of conflicts)
Write-Host "Pulling latest changes from remote..." -ForegroundColor Yellow
git pull origin $branch --rebase 2>&1

Write-Host ""

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin $branch 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your files have been pushed to:" -ForegroundColor White
    Write-Host "$repoUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Excluded files (not pushed):" -ForegroundColor Yellow
    Write-Host "  - All .md files (documentation)" -ForegroundColor Gray
    Write-Host "  - All .bat files (scripts)" -ForegroundColor Gray
    Write-Host "  - All .txt files (text files)" -ForegroundColor Gray
    Write-Host "  - .env files (sensitive data)" -ForegroundColor Gray
    Write-Host ""
}
else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  PUSH FAILED" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common solutions:" -ForegroundColor Yellow
    Write-Host "1. Make sure you are logged in to GitHub" -ForegroundColor White
    Write-Host "2. Check your internet connection" -ForegroundColor White
    Write-Host "3. Verify repository permissions" -ForegroundColor White
    Write-Host ""
    Write-Host "If prompted, enter your GitHub credentials:" -ForegroundColor Yellow
    Write-Host "  Username: joyboyyyy619" -ForegroundColor Cyan
    Write-Host "  Password: [Your GitHub Personal Access Token]" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To generate a token:" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "  2. Click Generate new token (classic)" -ForegroundColor White
    Write-Host "  3. Select repo scope" -ForegroundColor White
    Write-Host "  4. Copy the token and use it as password" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Read-Host "Press Enter to exit"
