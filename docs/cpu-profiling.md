# Startup CPU profiling

Run the Electron application with a project directory and a file:

```sh
lvce /path/to/project --open src/main.ts --cpu-profile
lvce /path/to/project --open src/main.ts --cpu-profile --cpu-profile-dir /path/to/profiles
```

Relative file paths resolve inside the project. Each run creates a unique `lvce-cpu-*` directory under the system temporary directory or the supplied output directory and prints its path. It uses fresh Chromium storage, opens the requested file without restoring editors or window state, waits for a diagnostics pass, flushes the capture, then exits. It does not overwrite the saved session from a normal application run.

`trace.json` is a Chromium trace containing sampled JavaScript stacks for main, renderer and web workers. Open it in Chrome's performance tools or a Chromium trace viewer. Each utility process also has a `.cpuprofile` file that can be imported into a JavaScript CPU profile viewer. `manifest.json` lists utility profiles and any errors. Capture begins before workspace utility processes and windows are created; Electron initialization before application readiness is outside the capture. Profiling adds overhead, so compare runs with the same options and environment.

Diagnostics completion means that every provider selected for this file has returned for the requested pass and its results have been committed and rendered. Empty results are valid. Later diagnostics publications or background work are outside this boundary. Provider failures, incomplete streams and a 30-second diagnostics timeout fail the run. The whole startup has a 60-second deadline. Failures still attempt to flush available artifacts and return a nonzero exit code; check both the exit code and manifest before using a capture for benchmarks.
