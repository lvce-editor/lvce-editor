// Executed by Windows PowerShell outside the directory being replaced. All
// variable input is read from a JSON plan, never interpolated into PowerShell.
export const activate = String.raw`
$ErrorActionPreference = 'Stop'
$plan = Get-Content -LiteralPath $env:LVCE_UPDATE_PLAN -Raw | ConvertFrom-Json
$install = [IO.Path]::GetFullPath($plan.install)
$stage = [IO.Path]::GetFullPath($plan.stage)
$backup = [IO.Path]::GetFullPath($plan.backup)
$parent = Split-Path -Parent $install
if ((Split-Path -Parent $stage) -ne $parent -or (Split-Path -Parent $backup) -ne $parent) { throw 'Update folders must be siblings' }
if ($stage -eq $install -or $backup -eq $install -or $stage -eq $backup) { throw 'Update folders must be distinct' }
if ((Split-Path -Leaf $stage) -ne ((Split-Path -Leaf $install) + '.stage-' + $plan.token)) { throw 'Invalid stage path' }
if ((Split-Path -Leaf $backup) -ne ((Split-Path -Leaf $install) + '.backup-' + $plan.token)) { throw 'Invalid backup path' }
if ($plan.token -notmatch '^[a-f0-9]{32}$') { throw 'Invalid update token' }
Set-Location -LiteralPath $parent
function Log($message) {
  $line = [DateTime]::UtcNow.ToString('o') + ' [windows-swap] ' + $message + [Environment]::NewLine
  [IO.File]::AppendAllText($plan.log, $line)
}
function Journal($phase) {
  [IO.File]::WriteAllText($env:LVCE_UPDATE_PLAN + '.state', $phase)
  Log $phase
}
function MoveFolder($from, $to) {
  for ($attempt=0; $attempt -lt 50; $attempt++) {
    try { [IO.Directory]::Move($from, $to); return } catch {
      if ($attempt -eq 49) { throw }
      Start-Sleep -Milliseconds 100
    }
  }
}
$movedOld = $false
$movedNew = $false
$editorExited = $false
$newProcess = $null
try {
  Journal 'helper-ready'
  [IO.File]::WriteAllText($env:LVCE_UPDATE_PLAN + '.started', 'ready')
  # The application exits only after the helper acknowledges startup. Never
  # kill an editor that refuses to exit, for example with an unsaved document.
  $deadline = [DateTime]::UtcNow.AddSeconds(60)
  while (Get-Process -Id $plan.parentPid -ErrorAction SilentlyContinue) {
    if ([DateTime]::UtcNow -gt $deadline) { throw 'Editor did not exit; installation left intact' }
    Start-Sleep -Milliseconds 100
  }
  Journal 'editor-exited'
  $editorExited = $true
  # Rerunning the saved helper after interruption restores a missing install.
  if (!(Test-Path -LiteralPath $install) -and (Test-Path -LiteralPath $backup)) {
    MoveFolder $backup $install
    throw 'Recovered previous installation; retry the update'
  }
  if (Test-Path -LiteralPath $backup) { throw 'Backup already exists; recovery required' }
  $config = Get-Content -LiteralPath (Join-Path $stage 'resources/app/config.json') -Raw | ConvertFrom-Json
  if ($config.version -ne $plan.version) { throw 'Staged version does not match update plan' }
  Journal 'moving-old'
  MoveFolder $install $backup
  $movedOld = $true
  Journal 'moving-new'
  MoveFolder $stage $install
  $movedNew = $true
  Journal 'launching-new'
  $newProcess = Start-Process -FilePath (Join-Path $install $plan.exe) -ArgumentList '--updated' -WorkingDirectory $install -PassThru -WindowStyle Hidden
  $deadline = [DateTime]::UtcNow.AddSeconds(60)
  while (!(Test-Path -LiteralPath $plan.ready)) {
    $newProcess.Refresh()
    if ($newProcess.HasExited) { throw 'Updated application exited before confirming startup' }
    if ([DateTime]::UtcNow -gt $deadline) { throw 'Updated application did not confirm startup' }
    Start-Sleep -Milliseconds 100
  }
  if ((Get-Content -LiteralPath $plan.ready -Raw) -ne $plan.token) { throw 'Invalid startup acknowledgment' }
  Journal 'startup-confirmed'
  try {
    Get-ChildItem 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall' | ForEach-Object {
      $entry = Get-ItemProperty -LiteralPath $_.PSPath
      if ($entry.InstallLocation -and $entry.InstallLocation.TrimEnd('\') -eq $install.TrimEnd('\')) {
        Set-ItemProperty -LiteralPath $_.PSPath -Name DisplayVersion -Value $plan.version
      }
    }
  } catch { Log ('Could not refresh installed version metadata: ' + $_.Exception.Message) }
  # Keep rollback files until after startup, outside the user-visible outage.
  Start-Sleep -Seconds 5
  $newProcess.Refresh()
  if ($newProcess.HasExited) { throw 'Updated application exited during startup' }
  Journal 'cleanup-started'
  try {
    # The backup prefix lengthens already-deep extension paths. PowerShell's
    # filesystem provider needs an extended path for recursive cleanup.
    $longBackup = '\\?\' + $backup
    if ($backup.StartsWith('\\')) { $longBackup = '\\?\UNC\' + $backup.Substring(2) }
    Remove-Item -LiteralPath $longBackup -Recurse -Force
    if ($plan.archive -eq (Join-Path ($install + '.updates') ($plan.token + '.zip'))) {
      Remove-Item -LiteralPath $plan.archive -Force -ErrorAction SilentlyContinue
    }
    Journal 'complete'
  }
  catch { Log ('Cleanup deferred; backup retained: ' + $_.Exception.Message) }
} catch {
  Log ('Update failed: ' + $_.Exception.Message)
  if ($movedOld) {
    if ($newProcess -and !$newProcess.HasExited) {
      & taskkill.exe /PID $newProcess.Id /T /F | Out-Null
    }
    try {
      if ($movedNew) { MoveFolder $install $stage }
      MoveFolder $backup $install
      Journal 'rolled-back'
      Start-Process -FilePath (Join-Path $install $plan.exe) -WorkingDirectory $install -WindowStyle Hidden
    } catch { Log ('Recovery required; previous installation preserved at ' + $backup + ': ' + $_.Exception.Message) }
  } elseif ($editorExited -and (Test-Path -LiteralPath (Join-Path $install $plan.exe))) {
    # A locked old folder or rejected plan must not leave the user without the
    # still-intact editor after the requested shutdown.
    try { Start-Process -FilePath (Join-Path $install $plan.exe) -WorkingDirectory $install -WindowStyle Hidden }
    catch { Log ('Could not relaunch previous installation: ' + $_.Exception.Message) }
  }
  exit 1
}
`

export const extract = String.raw`
$ErrorActionPreference = 'Stop'
$plan = Get-Content -LiteralPath $env:LVCE_UPDATE_PLAN -Raw | ConvertFrom-Json
# Windows PowerShell's .NET Framework ZIP extraction fails on deeply nested
# extension paths. The Windows inbox bsdtar supports these long paths and
# rejects parent-directory traversal by default. Never reuse a partial stage.
if (Test-Path -LiteralPath $plan.stage) { throw 'Staging directory already exists' }
[IO.Directory]::CreateDirectory($plan.stage) | Out-Null
& (Join-Path $env:SystemRoot 'System32\tar.exe') -xf $plan.archive -C $plan.stage
if ($LASTEXITCODE -ne 0) { throw "Windows update extraction failed ($LASTEXITCODE)" }
`
