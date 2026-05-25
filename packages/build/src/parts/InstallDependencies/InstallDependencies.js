import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as Process from '../Process/Process.js'

const installCommands = ['npm ci --ignore-scripts', 'npm run postinstall']

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
  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      for (const command of installCommands) {
        execSyncFn(command, { stdio: 'inherit' })
      }

      return
    } catch (error) {
      lastError = error

      if (attempt === maxAttempts) {
        throw error
      }

      log(`npm ci failed on attempt ${attempt}, retrying...`)
    }
  }

  throw lastError
}

const main = () => {
  try {
    installDependenciesWithRetry(/** @type {ExecSyncFn} */ (execSync))
  } catch {
    Process.exit(ExitCode.Error)
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main()
}
