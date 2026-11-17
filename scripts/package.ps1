$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
& node (Join-Path $PSScriptRoot 'generate.mjs') --check
if ($LASTEXITCODE -ne 0) { throw 'Generated files are out of date.' }
Push-Location $projectRoot
try {
    & node --test
    if ($LASTEXITCODE -ne 0) { throw 'Theme validation failed.' }
    $manifest = Get-Content -LiteralPath (Join-Path $projectRoot 'plugin.toml') -Raw
    $pluginId = [regex]::Match($manifest, '(?m)^id = "([^"]+)"').Groups[1].Value
    $version = [regex]::Match($manifest, '(?m)^version = "([^"]+)"').Groups[1].Value
    if (!$pluginId -or !$version) { throw 'Missing plugin ID or version.' }
    $distDir = Join-Path $projectRoot 'dist'
    New-Item -ItemType Directory -Path $distDir -Force | Out-Null
    $archivePath = Join-Path $distDir "$pluginId-$version.zip"
    Add-Type -AssemblyName System.IO.Compression
    $file = [System.IO.File]::Open($archivePath, [System.IO.FileMode]::Create)
    $zip = [System.IO.Compression.ZipArchive]::new($file, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        $files = @('plugin.toml', 'icon.svg', 'LICENSE', 'NOTICE.md', 'README.md')
        $files += Get-ChildItem -LiteralPath (Join-Path $projectRoot 'themes') -File -Filter '*.json' | ForEach-Object { "themes/$($_.Name)" }
        foreach ($relative in $files) {
            $entry = $zip.CreateEntry($relative, [System.IO.Compression.CompressionLevel]::Optimal)
            $entry.LastWriteTime = [DateTimeOffset]::new(2026, 1, 1, 0, 0, 0, [TimeSpan]::Zero)
            $output = $entry.Open()
            try {
                $bytes = [System.IO.File]::ReadAllBytes((Join-Path $projectRoot $relative))
                $output.Write($bytes, 0, $bytes.Length)
            } finally { $output.Dispose() }
        }
    } finally { $zip.Dispose(); $file.Dispose() }
    Write-Output "Created $archivePath"
} finally { Pop-Location }
