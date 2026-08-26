# Helper script to build and push Docker image to Docker Hub
# Usage: .\docker-push.ps1 -DockerUsername "your_dockerhub_username" [-ImageName "apr-services-fullstack"] [-Tag "latest"]

param (
    [Parameter(Mandatory=$true)]
    [string]$DockerUsername,

    [string]$ImageName = "apr-services-fullstack",
    [string]$Tag = "latest"
)

$FullImage = "$DockerUsername/${ImageName}:$Tag"

Write-Host "🔐 Logging in to Docker Hub..." -ForegroundColor Cyan
docker login

if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker login failed."
    exit $LASTEXITCODE
}

Write-Host "🔨 Building Docker image ($FullImage)..." -ForegroundColor Cyan
docker build -t $FullImage -f Dockerfile .

if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker build failed."
    exit $LASTEXITCODE
}

Write-Host "🚀 Pushing image to Docker Hub..." -ForegroundColor Cyan
docker push $FullImage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Image successfully pushed to https://hub.docker.com/r/$DockerUsername/$ImageName" -ForegroundColor Green
} else {
    Write-Error "Failed to push image to Docker Hub."
}
