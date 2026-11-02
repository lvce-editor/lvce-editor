import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as Process from '../Process/Process.ts'

// Serialize native builds to avoid overlapping package builds during retries.
const installCommands = ['npm ci --ignore-scripts', 'npm rebuild --workspaces --foreground-scripts', 'npm run postinstall']

/**
 * @typedef {{stdio: 'inherit'}} InstallCommandOptions
 */

/**
 * @typedef {(command: string, options: InstallCommandOptions) => void} ExecSyncFn
 */

/**
 * @param {ExecSyncFn} execSyncFn
 * @param {(message: string) => void} [log]
 * @param {number} [maxAttempts]
 */
export const installDependenciesWithRetry = (execSyncFn, log = console.log, maxAttempts = 3) => {
  for (const command of installCommands) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        execSyncFn(command, { stdio: 'inherit' })
        break
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error
        }

        log(`${command} failed on attempt ${attempt}/${maxAttempts}, retrying...`)
      }
    }
  }
}

const main = () => {
  try {
    installDependenciesWithRetry(/** @type {ExecSyncFn} */ execSync)
  } catch {
    Process.exit(ExitCode.Error)
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main()
}
