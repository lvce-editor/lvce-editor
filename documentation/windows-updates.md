# Windows update diagnostics

## Staged Windows updates

New Windows releases publish `Lvce-Stage-v<version>-<arch>.json` to declare that
their official NSIS installer supports preparation without installation. The desktop
checks the actual installed version, downloads the installer, verifies its GitHub
SHA256 digest, and invokes `/S /LVCESTAGE` with `LVCE_UPDATE_STAGE` set to a fresh
sibling directory in the child environment. Keeping the path out of the command
line avoids NSIS option-parsing differences for paths containing spaces. This mode
extracts directly into that directory and writes a completion marker. It does not
close the editor, uninstall files, or register another installation. Existing
destination directories are rejected. This uses the normal installer extraction
path; it does not change Windows application-control policy or trust metadata.

Releases without this capability retain the existing NSIS update path. New releases
do not publish the earlier ZIP payload, so clients with the old ZIP updater also
fall back to normal installation. NSIS handles deep extension paths; backup cleanup
uses extended-length paths for the same reason. Windows CI tests the actual built
installer in a path containing spaces, checks registration is unchanged, and checks
that a second preparation cannot overwrite an existing directory.

On Restart, an independent Windows PowerShell helper acknowledges startup before the
editor exits. It waits for the main process to exit, renames the old directory to a
unique backup, renames the prepared directory into place, and starts the new app.
The new shared process acknowledges its version after creating the app window.
Startup failure restores the backup; cleanup occurs only after acknowledgment and
a short stability check. Normal NSIS installation and uninstall remain available.
The existing uninstaller is retained, and the registered installation path does not
change. User settings live outside the swapped tree.

The helper is launched with `Start-Process -WindowStyle Hidden` through a short
bootstrap. This gives Windows PowerShell its own console without using Node's
`DETACHED_PROCESS` flag, which can make hidden PowerShell exit without executing.
Helper output goes to the plan's `.output.log`, separate from `log-updates.txt`,
so Windows file sharing does not prevent phase logging. A process test verifies
that the helper executes and logs after its launcher has exited.

Each phase is timestamped in `log-updates.txt`. Plans, helper scripts and state
journals are stored in the sibling `<installation>.updates` directory. After a
power loss between the two renames, the preserved backup may need recovery by
rerunning the saved helper with its plan, or by renaming the backup into the missing
installation path. The pair of renames is not a single atomic transaction. A locked
folder aborts after bounded retries. Preparation needs writable sibling storage on
the installation volume; restricted/machine-wide installations can fail preparation
without modifying the running application. Failed preparations are retained for
diagnosis, rather than recursively deleting an uncertain path.

Windows integration tests exercise successful acknowledgment/cleanup, rollback
after launch failure, and rejection of out-of-tree staging paths. Digest tests
reject corrupted payloads. Release validation must still verify a real newer
installed version and measure preparation separately from restart interruption.

Update-worker requests and their host RPC actions are recorded in `log-updates.txt`.
Entries include timestamps, the shared-process PID, installer path and arguments,
launch errors, and exit status while the shared process remains alive. Installer
stdout and stderr are appended directly to that file and remain connected to disk
after the editor exits. Worker logging failures do not prevent update checks.

The logs directory is the application's existing state directory: by default,
`%USERPROFILE%/.local/state/lvce/logs` on Windows (`lvce-oss` for a development
build), respecting `XDG_STATE_HOME` when configured. Logs are appended across restarts. Update events are also
mirrored into `log-shared-process.txt`, visible in **Output → Shared Process**.
The shared-process logger uses this same directory instead of a separate temp file.

“Installer started” means that Windows created the installer process; it does not
prove successful installation. The editor can exit before an installer exit event
is received. In that case, inspect installer output and verify the actual version
in About after reopening. An absent exit entry must not be interpreted as success.
NSIS does not necessarily write details to stdout/stderr.

## Validation

The update worker requests `Exec.exec` with `detached: true`. This must spawn with
independent stdio and unref the child, returning only after the spawn event. It must
not use `execFileSync`, which discards the requested detachment. The legacy NSIS
entry point uses the same launcher. Non-detached Exec callers retain their existing
wait/error behavior.

`packages/shared-process/test/Exec.test.ts` exercises actual child processes,
including one that writes its completion marker only after its parent has exited.
It also checks output capture, nonzero exit diagnostics, launch errors, and log
retention. Renderer tests cover worker errors and unavailable logging.

For a release smoke test, install a build containing the fix, offer it a newer
release, accept download and restart, and verify that the app reopens with the
newer actual version. Preserve user update settings and distinguish any emulated
version from the installed version. Unit/process tests alone do not validate NSIS
replacement or relaunch.
