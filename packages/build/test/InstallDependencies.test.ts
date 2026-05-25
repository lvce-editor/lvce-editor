import { describe, expect, test } from '@jest/globals'
import { installDependenciesWithRetry } from '../src/parts/InstallDependencies/InstallDependencies.js'

type ExecSyncFn = Parameters<typeof installDependenciesWithRetry>[0]

describe('installDependenciesWithRetry', () => {
  test('runs npm ci and postinstall once when the first attempt succeeds', () => {
    const commands: string[] = []
    const execSyncFn: ExecSyncFn = (command, options) => {
      commands.push(command)
      expect(options).toEqual({ stdio: 'inherit' })
    }

    installDependenciesWithRetry(execSyncFn, () => {})

    expect(commands).toEqual(['npm ci --ignore-scripts', 'npm run postinstall'])
  })

  test('retries the full install flow until it succeeds', () => {
    const commands: string[] = []
    let attempt = 0
    const execSyncFn: ExecSyncFn = (command) => {
      commands.push(command)
      if (command === 'npm ci --ignore-scripts') {
        attempt++
        if (attempt < 3) {
          throw new Error('transient failure')
        }
      }
    }

    installDependenciesWithRetry(execSyncFn, () => {})

    expect(commands).toEqual(['npm ci --ignore-scripts', 'npm ci --ignore-scripts', 'npm ci --ignore-scripts', 'npm run postinstall'])
  })

  test('throws after the maximum number of attempts', () => {
    let logCount = 0
    const execSyncFn: ExecSyncFn = () => {
      throw new Error('persistent failure')
    }

    expect(() =>
      installDependenciesWithRetry(execSyncFn, () => {
        logCount++
      }),
    ).toThrow('persistent failure')

    expect(logCount).toBe(2)
  })
})
