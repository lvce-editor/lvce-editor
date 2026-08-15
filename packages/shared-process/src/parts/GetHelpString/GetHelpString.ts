import * as Platform from '../Platform/Platform.ts'

export const getHelpString = (): any => {
  return `${Platform.applicationName} v${Platform.version}

Usage:
  ${Platform.applicationName} [path]

Diagnostics:
  --trace-ipc=<worker-ids>  Trace comma-separated worker IDs (or *) to JSONL.
                            Traces can be large and contain source code.
`
}
