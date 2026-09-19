# Windows update diagnostics

## Staged Windows updates

New Windows releases also publish `Lvce-Update-v<version>-<arch>.zip` containing
the application payload. The desktop checks the actual installed version, downloads
the matching release asset, verifies its GitHub SHA256 digest, and extracts directly
into a unique sibling of the installation directory. The editor stays open during
preparation. Older releases without this asset retain the existing NSIS update path.
Extraction uses the Windows inbox `tar.exe` so deeply nested extension paths work
beyond `MAX_PATH`; backup cleanup uses extended-length paths for the same reason.

On Restart, a detached Windows PowerShell helper acknowledges startup before the
editor exits. It waits for the main process to exit, renames the old directory to a
unique backup, renames the prepared directory into place, and starts the new app.
The new shared process acknowledges its version after creating the app window.
Startup failure restores the backup; cleanup occurs only after acknowledgment and
a short stability check. Normal NSIS installation and uninstall remain available.
The existing uninstaller is retained, and the registered installation path does not
change. User settings live outside the swapped tree.

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
