import { describe, expect, test } from '@jest/globals'
import { installDependencies } from '../src/parts/InstallDependencies/InstallDependencies.js'

describe('installDependencies', () => {
  test('runs npm ci and postinstall once when the first attempt succeeds', () => {
    const commands: string[] = []

    installDependencies({
      execSyncFn: (command, options) => {
        commands.push(command)
        expect(options).toEqual({ stdio: 'inherit' })
      },
      log: () => {},
    })

    expect(commands).toEqual(['npm ci --ignore-scripts', 'npm run postinstall'])
  })

  test('retries the full install flow until it succeeds', () => {
    const commands: string[] = []
    let attempt = 0

    installDependencies({
      execSyncFn: (command) => {
        commands.push(command)
        if (command === 'npm ci --ignore-scripts') {
          attempt++
          if (attempt < 3) {
            throw new Error('transient failure')
          }
        }
      },
      log: () => {},
    })

    expect(commands).toEqual(['npm ci --ignore-scripts', 'npm ci --ignore-scripts', 'npm ci --ignore-scripts', 'npm run postinstall'])
  })

  test('throws after the maximum number of attempts', () => {
    let logCount = 0

    expect(() =>
      installDependencies({
        execSyncFn: () => {
          throw new Error('persistent failure')
        },
        log: () => {
          logCount++
        },
      }),
    ).toThrow('persistent failure')

    expect(logCount).toBe(2)
  })
})