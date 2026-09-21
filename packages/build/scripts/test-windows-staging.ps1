param([string]$Installer, [ValidateSet('x64', 'arm64')][string]$Architecture = 'x64')
$ErrorActionPreference = 'Stop'
if (!$Installer) {
  $candidates = @(Get-ChildItem 'packages/build/.tmp/releases' -Filter "*-$Architecture.exe")
  if ($candidates.Count -ne 1) { throw 'Expected one built Windows installer' }
  $Installer = $candidates[0].FullName
}
$Installer = (Resolve-Path -LiteralPath $Installer).Path
$stage = Join-Path (Get-Location).Path ('packages/build/.tmp/staged installer test ' + [Guid]::NewGuid().ToString('N'))
$nativeStage = if ($stage.StartsWith('\\')) { '\\?\UNC\' + $stage.Substring(2) } else { '\\?\' + $stage }
function InstalledEntries {
  @(Get-ChildItem 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall' -ErrorAction SilentlyContinue |
    Get-ItemProperty | Where-Object DisplayName -like '*Lvce*' |
    Select-Object DisplayName, DisplayVersion, InstallLocation) | ConvertTo-Json -Compress
}
$before = InstalledEntries
$timer = [Diagnostics.Stopwatch]::StartNew()
$process = Start-Process -FilePath $Installer -ArgumentList @('/S', '/LVCESTAGE') -Environment @{ LVCE_UPDATE_STAGE = $nativeStage } -WindowStyle Hidden -PassThru
if (!$process.WaitForExit(300000)) { throw 'Installer preparation timed out' }
if ($process.ExitCode -ne 0) { throw "Preparation failed: $($process.ExitCode)" }
if ((Get-Content -LiteralPath (Join-Path $stage '.lvce-stage-complete') -Raw) -ne 'complete') { throw 'Missing preparation acknowledgment' }
$config = Get-Content -LiteralPath (Join-Path $stage 'resources/app/config.json') -Raw | ConvertFrom-Json
$builder = Get-Content -LiteralPath 'packages/build/.tmp/electron-builder/package.json' -Raw | ConvertFrom-Json
if (!$config.version -or !(Test-Path -LiteralPath (Join-Path $stage ($builder.productName + '.exe')))) { throw 'Invalid prepared application' }
$payload = Join-Path (Get-Location).Path 'packages/build/.tmp/linux/snap/amd64/app'
$expectedFiles = @(Get-ChildItem -LiteralPath $payload -File -Recurse -Force)
$actualFiles = @(Get-ChildItem -LiteralPath $stage -File -Recurse -Force)
$expectedPaths = @($expectedFiles | ForEach-Object { [IO.Path]::GetRelativePath($payload, $_.FullName) })
$actualPaths = @($actualFiles | ForEach-Object { [IO.Path]::GetRelativePath($stage, $_.FullName) } | Where-Object { $_ -ne '.lvce-stage-complete' })
$differences = @(Compare-Object $expectedPaths $actualPaths)
if ($differences.Count) { throw ('Prepared payload differs: ' + ($differences | ConvertTo-Json -Compress)) }
foreach ($file in $expectedFiles) {
  $relative = [IO.Path]::GetRelativePath($payload, $file.FullName)
  $actual = Join-Path $stage $relative
  if ((Get-FileHash -LiteralPath $actual).Hash -ne (Get-FileHash -LiteralPath $file.FullName).Hash) {
    throw "Prepared file differs: $relative"
  }
}
$ptyHost = Join-Path $stage 'resources/app/packages/shared-process/node_modules/@lvce-editor/pty-host'
$nodePty = Join-Path $stage 'resources/app/packages/shared-process/node_modules/node-pty'
foreach ($path in @(
  (Join-Path $ptyHost 'dist/ptyHostMain.js'),
  (Join-Path $ptyHost 'package.json'),
  (Join-Path $nodePty 'package.json'),
  (Join-Path $nodePty 'lib/index.js'),
  (Join-Path $nodePty 'build/Release/pty.node')
)) {
  if (!(Test-Path -LiteralPath $path -PathType Leaf)) { throw "Missing packaged node-pty runtime file: $path" }
}
if ($Architecture -eq 'x64') {
  $probe = Join-Path $ptyHost 'dist/pty-staging-smoke.mjs'
  @'
import { spawn } from 'node-pty'

const marker = 'LVCE_PTY_SMOKE'
const terminal = spawn(process.env.ComSpec, ['/d', '/c', `echo ${marker}`], {
  cols: 80,
  rows: 24,
})
let output = ''
const timeout = setTimeout(() => {
  console.error('PTY smoke test timed out')
  terminal.kill()
  process.exit(1)
}, 30000)
terminal.onData((data) => {
  output += data
})
terminal.onExit(({ exitCode }) => {
  clearTimeout(timeout)
  if (exitCode !== 0 || !output.includes(marker)) {
    console.error(`PTY smoke test failed: exitCode=${exitCode}, output=${JSON.stringify(output)}`)
    process.exit(1)
  }
})
'@ | Set-Content -LiteralPath $probe
  $electron = Join-Path $stage ($builder.productName + '.exe')
  $stdout = Join-Path $stage 'pty-staging-smoke.stdout'
  $stderr = Join-Path $stage 'pty-staging-smoke.stderr'
  $probeArgument = '"' + $probe + '"'
  $smoke = Start-Process -FilePath $electron -ArgumentList @($probeArgument) -Environment @{ ELECTRON_RUN_AS_NODE = '1' } -WorkingDirectory $stage -WindowStyle Hidden -Wait -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr
  if ($smoke.ExitCode -ne 0) {
    throw "Packaged node-pty smoke test failed: $((Get-Content -LiteralPath $stderr -Raw).Trim())"
  }
}
if ((InstalledEntries) -ne $before) { throw 'Preparation changed registered installations' }
$sentinel = Join-Path $stage 'preserve-existing.txt'
Set-Content -LiteralPath $sentinel 'preserved'
$retry = Start-Process -FilePath $Installer -ArgumentList @('/S', '/LVCESTAGE') -Environment @{ LVCE_UPDATE_STAGE = $nativeStage } -WindowStyle Hidden -PassThru
if (!$retry.WaitForExit(30000) -or $retry.ExitCode -eq 0) { throw 'Installer accepted an existing staging directory' }
if ((Get-Content -LiteralPath $sentinel -Raw).Trim() -ne 'preserved') { throw 'Existing stage changed' }
foreach ($arguments in @(@('/S', '/LVCESTAGE'), @('/S', '/INVALIDSTAGE'))) {
  $destination = if ($arguments[1] -eq '/LVCESTAGE') { '' } else { $nativeStage + '-invalid' }
  $invalid = Start-Process -FilePath $Installer -ArgumentList $arguments -Environment @{ LVCE_UPDATE_STAGE = $destination } -WindowStyle Hidden -PassThru
  if (!$invalid.WaitForExit(30000) -or $invalid.ExitCode -eq 0) { throw 'Installer accepted malformed staging request' }
}
$invalid = Start-Process -FilePath $Installer -ArgumentList @('/S', '/LVCESTAGE') -Environment @{ LVCE_UPDATE_STAGE = ($stage + '-plain') } -WindowStyle Hidden -PassThru
if (!$invalid.WaitForExit(30000) -or $invalid.ExitCode -eq 0) { throw 'Installer accepted a destination without long-path support' }
if ((InstalledEntries) -ne $before) { throw 'Rejected request changed registered installations' }
Write-Output "Staged installer validated in $($timer.Elapsed.TotalSeconds) seconds, version $($config.version)"
