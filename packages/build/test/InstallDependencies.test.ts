import { describe, expect, test } from '@jest/globals'
import { installDependenciesWithRetry } from '../src/parts/InstallDependencies/InstallDependencies.ts'

type ExecSyncFn = Parameters<typeof installDependenciesWithRetry>[0]

describe('installDependenciesWithRetry', () => {
  test('runs npm ci and postinstall once when the first attempt succeeds', () => {
    const commands: string[] = []
    const execSyncFn: ExecSyncFn = (command, options) => {
      commands.push(command)
      expect(options).toEqual({ stdio: 'inherit' })
    }

    installDependenciesWithRetry(execSyncFn, () => {})

    expect(commands).toEqual(['npm ci --ignore-scripts', 'npm rebuild --workspaces --foreground-scripts', 'npm run postinstall'])
  })

  test('retries npm ci until it succeeds', () => {
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

    expect(commands).toEqual([
      'npm ci --ignore-scripts',
      'npm ci --ignore-scripts',
      'npm ci --ignore-scripts',
      'npm rebuild --workspaces --foreground-scripts',
      'npm run postinstall',
    ])
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

  test('retries a failed native rebuild without deleting installed dependencies', () => {
    const commands: string[] = []
    let rebuildAttempts = 0
    const execSyncFn: ExecSyncFn = (command) => {
      commands.push(command)
      if (command === 'npm rebuild --workspaces --foreground-scripts' && ++rebuildAttempts < 3) {
        throw new Error('Completion callback never invoked!')
      }
    }

    installDependenciesWithRetry(execSyncFn, () => {})

    expect(commands).toEqual([
      'npm ci --ignore-scripts',
      'npm rebuild --workspaces --foreground-scripts',
      'npm rebuild --workspaces --foreground-scripts',
      'npm rebuild --workspaces --foreground-scripts',
      'npm run postinstall',
    ])
  })

  test('retries postinstall without repeating a successful native rebuild', () => {
    const commands: string[] = []
    let postinstallAttempts = 0
    const execSyncFn: ExecSyncFn = (command) => {
      commands.push(command)
      if (command === 'npm run postinstall' && ++postinstallAttempts < 2) {
        throw new Error('transient failure')
      }
    }

    installDependenciesWithRetry(execSyncFn, () => {})

    expect(commands).toEqual(['npm ci --ignore-scripts', 'npm rebuild --workspaces --foreground-scripts', 'npm run postinstall', 'npm run postinstall'])
  })

  test('stops after a persistent rebuild failure and preserves its error', () => {
    const commands: string[] = []
    const failure = new Error('native compilation failed')
    const execSyncFn: ExecSyncFn = (command) => {
      commands.push(command)
      if (command === 'npm rebuild --workspaces --foreground-scripts') {
        throw failure
      }
    }

    expect(() => installDependenciesWithRetry(execSyncFn, () => {}, 2)).toThrow(failure)
    expect(commands).toEqual(['npm ci --ignore-scripts', 'npm rebuild --workspaces --foreground-scripts', 'npm rebuild --workspaces --foreground-scripts'])
  })
})
