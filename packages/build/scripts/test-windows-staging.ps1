param([string]$Installer)
$ErrorActionPreference = 'Stop'
if (!$Installer) {
  $candidates = @(Get-ChildItem 'packages/build/.tmp/releases' -Filter '*.exe')
  if ($candidates.Count -ne 1) { throw 'Expected one built Windows installer' }
  $Installer = $candidates[0].FullName
}
$Installer = (Resolve-Path -LiteralPath $Installer).Path
$stage = Join-Path (Get-Location).Path ('packages/build/.tmp/staged installer test ' + [Guid]::NewGuid().ToString('N'))
function InstalledEntries {
  @(Get-ChildItem 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall' -ErrorAction SilentlyContinue |
    Get-ItemProperty | Where-Object DisplayName -like '*Lvce*' |
    Select-Object DisplayName, DisplayVersion, InstallLocation) | ConvertTo-Json -Compress
}
$before = InstalledEntries
$timer = [Diagnostics.Stopwatch]::StartNew()
$process = Start-Process -FilePath $Installer -ArgumentList @('/S', '/LVCESTAGE') -Environment @{ LVCE_UPDATE_STAGE = $stage } -WindowStyle Hidden -PassThru
if (!$process.WaitForExit(300000)) { throw 'Installer preparation timed out' }
if ($process.ExitCode -ne 0) { throw "Preparation failed: $($process.ExitCode)" }
if ((Get-Content -LiteralPath (Join-Path $stage '.lvce-stage-complete') -Raw) -ne 'complete') { throw 'Missing preparation acknowledgment' }
$config = Get-Content -LiteralPath (Join-Path $stage 'resources/app/config.json') -Raw | ConvertFrom-Json
$builder = Get-Content -LiteralPath 'packages/build/.tmp/electron-builder/package.json' -Raw | ConvertFrom-Json
if (!$config.version -or !(Test-Path -LiteralPath (Join-Path $stage ($builder.productName + '.exe')))) { throw 'Invalid prepared application' }
$payload = Join-Path (Get-Location).Path 'packages/build/.tmp/linux/snap/amd64/app'
$expectedFiles = @(Get-ChildItem -LiteralPath $payload -File -Recurse -Force)
$actualFiles = @(Get-ChildItem -LiteralPath $stage -File -Recurse -Force)
if ($actualFiles.Count -ne ($expectedFiles.Count + 1)) { throw 'Prepared payload has missing or unexpected files' }
foreach ($file in $expectedFiles) {
  $relative = [IO.Path]::GetRelativePath($payload, $file.FullName)
  $actual = Join-Path $stage $relative
  if ((Get-FileHash -LiteralPath $actual).Hash -ne (Get-FileHash -LiteralPath $file.FullName).Hash) {
    throw "Prepared file differs: $relative"
  }
}
if ((InstalledEntries) -ne $before) { throw 'Preparation changed registered installations' }
$sentinel = Join-Path $stage 'preserve-existing.txt'
Set-Content -LiteralPath $sentinel 'preserved'
$retry = Start-Process -FilePath $Installer -ArgumentList @('/S', '/LVCESTAGE') -Environment @{ LVCE_UPDATE_STAGE = $stage } -WindowStyle Hidden -PassThru
if (!$retry.WaitForExit(30000) -or $retry.ExitCode -eq 0) { throw 'Installer accepted an existing staging directory' }
if ((Get-Content -LiteralPath $sentinel -Raw).Trim() -ne 'preserved') { throw 'Existing stage changed' }
foreach ($arguments in @(@('/S', '/LVCESTAGE'), @('/S', '/INVALIDSTAGE'))) {
  $destination = if ($arguments[1] -eq '/LVCESTAGE') { '' } else { $stage + '-invalid' }
  $invalid = Start-Process -FilePath $Installer -ArgumentList $arguments -Environment @{ LVCE_UPDATE_STAGE = $destination } -WindowStyle Hidden -PassThru
  if (!$invalid.WaitForExit(30000) -or $invalid.ExitCode -eq 0) { throw 'Installer accepted malformed staging request' }
}
if ((InstalledEntries) -ne $before) { throw 'Rejected request changed registered installations' }
Write-Output "Staged installer validated in $($timer.Elapsed.TotalSeconds) seconds, version $($config.version)"
