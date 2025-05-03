$apiDirs = @(
    "app\api\auth\login",
    "app\api\auth\logout",
    "app\api\auth\register",
    "app\api\auth\refresh-token",
    "app\api\auth\user",
    "app\api\dashboard\summary",
    "app\api\dashboard\portfolio-value",
    "app\api\dashboard\recent-activity",
    "app\api\dashboard\portfolio-overview",
    "app\api\dashboard\project-funding",
    "app\api\dashboard\tokenized-ip",
    "app\api\licensing\deals",
    "app\api\licensing\templates",
    "app\api\royalties\summary",
    "app\api\royalties\income",
    "app\api\royalties\transactions",
    "app\api\royalties\analytics",
    "app\api\royalties\forecasts",
    "app\api\royalties\export",
    "app\api\orders",
    "app\api\ip-assets",
    "app\api\investments",
    "app\api\blockchain\tokens",
    "app\api\blockchain\transactions",
    "app\api\blockchain\nfts",
    "app\api\blockchain\price-data",
    "app\api\user\profile",
    "app\api\user\settings",
    "app\api\user\notifications",
    "app\api\wallet\balance",
    "app\api\wallet\transactions",
    "app\api\analytics\performance",
    "app\api\analytics\revenue",
    "app\api\analytics\trends",
    "app\api\reports\generate",
    "app\api\reports\download"
)

foreach ($dir in $apiDirs) {
    $path = Join-Path -Path "." -ChildPath $dir
    if (!(Test-Path -Path $path)) {
        New-Item -ItemType Directory -Path $path -Force
        Write-Host "Created directory: $path"
    }
}
