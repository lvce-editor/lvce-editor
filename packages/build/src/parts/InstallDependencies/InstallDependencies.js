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
 * @typedef {{
 *   execSyncFn?: ExecSyncFn
 *   maxAttempts?: number
 *   log?: (message: string) => void
 * }} InstallDependenciesOptions
 */

/**
 * @param {InstallDependenciesOptions} [options]
 */
export const installDependencies = (options = {}) => {
  const { execSyncFn = /** @type {ExecSyncFn} */ (execSync), maxAttempts = 3, log = console.log } = options
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
    installDependencies()
  } catch {
    Process.exit(ExitCode.Error)
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main()
}
