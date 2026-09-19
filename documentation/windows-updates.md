# Windows update diagnostics

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
