import * as Platform from '../Platform/Platform.ts'

export const getHelpString = (): any => {
  return `${Platform.applicationName} v${Platform.version}

Usage:
  ${Platform.applicationName} [path]

Extension development:
  --link <path>             Link an extension for this run. May be repeated.
  --start-dev-server        Run npm run dev in linked extension folders.
  --hot-reload              Restart linked extensions when their files change.

Diagnostics:
  --trace-ipc=<worker-ids>  Trace comma-separated worker IDs (or *) to JSONL.
                            Traces can be large and contain source code.
`
}
