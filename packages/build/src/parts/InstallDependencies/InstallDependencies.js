import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as Process from '../Process/Process.js'

const installCommands = ['npm ci --ignore-scripts', 'npm run postinstall']

export const installDependencies = ({ execSyncFn = execSync, maxAttempts = 3, log = console.log } = {}) => {
  let lastError = undefined
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
      log(`npm install failed on attempt ${attempt}, retrying...`)
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