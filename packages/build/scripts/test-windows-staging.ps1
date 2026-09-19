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
if (!$config.version -or !(Test-Path -LiteralPath (Join-Path $stage ($config.productName + '.exe')))) { throw 'Invalid prepared application' }
if ((InstalledEntries) -ne $before) { throw 'Preparation changed registered installations' }
$sentinel = Join-Path $stage 'preserve-existing.txt'
Set-Content -LiteralPath $sentinel 'preserved'
$retry = Start-Process -FilePath $Installer -ArgumentList @('/S', '/LVCESTAGE') -Environment @{ LVCE_UPDATE_STAGE = $stage } -WindowStyle Hidden -PassThru
if (!$retry.WaitForExit(30000) -or $retry.ExitCode -eq 0) { throw 'Installer accepted an existing staging directory' }
if ((Get-Content -LiteralPath $sentinel -Raw).Trim() -ne 'preserved') { throw 'Existing stage changed' }
Write-Output "Staged installer validated in $($timer.Elapsed.TotalSeconds) seconds, version $($config.version)"
