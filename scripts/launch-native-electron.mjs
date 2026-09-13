import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { createRequire } from 'node:module'

const { chromium } = createRequire(new URL('../packages/extension-host-worker-tests/package.json', import.meta.url))('playwright')

// Electron's Playwright launcher emulates focus on native child pages. Use CDP
// without overrides so document.visibilityState reflects the real native view.
export const launchNativeElectron = async ({ executablePath, args, cwd, env }) => {
  const child = spawn(executablePath, ['--inspect=0', '--remote-debugging-port=0', ...args], { cwd, env, stdio: ['ignore', 'ignore', 'pipe'] })
  const exited = once(child, 'exit')
  let socket
  let browser
  try {
    const endpoints = await new Promise((resolve, reject) => {
      let output = ''
      const timer = setTimeout(() => reject(new Error('Electron debugger endpoints did not start: ' + output)), 60000)
      child.once('error', (error) => {
        clearTimeout(timer)
        reject(error)
      })
      child.once('exit', () => {
        clearTimeout(timer)
        reject(new Error('Electron exited before its debugger endpoints started: ' + output))
      })
      child.stderr.on('data', (data) => {
        output = (output + data).slice(-10000)
        const main = output.match(/Debugger listening on (ws:\/\/[^\s]+)/)?.[1]
        const renderer = output.match(/DevTools listening on (ws:\/\/[^\s]+)/)?.[1]
        if (main && renderer) {
          clearTimeout(timer)
          resolve({ main, renderer })
        }
      })
    })
    socket = new WebSocket(endpoints.main)
    await once(socket, 'open')
    let nextId = 0
    const pending = new Map()
    socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data)
      const request = pending.get(message.id)
      if (!request) return
      pending.delete(message.id)
      clearTimeout(request.timer)
      if (message.error || message.result?.exceptionDetails)
        request.reject(new Error(JSON.stringify(message.error || message.result.exceptionDetails)))
      else request.resolve(message.result.result.value)
    })
    const evaluate = (fn, arg) =>
      new Promise((resolve, reject) => {
        const id = ++nextId
        const timer = setTimeout(() => {
          pending.delete(id)
          reject(new Error('Electron main-process evaluation timed out'))
        }, 15000)
        pending.set(id, { resolve, reject, timer })
        socket.send(
          JSON.stringify({
            id,
            method: 'Runtime.evaluate',
            params: {
              expression: `(${fn})(process.getBuiltinModule('module').createRequire(process.execPath)('electron'), ${JSON.stringify(arg) ?? 'undefined'})`,
              awaitPromise: true,
              returnByValue: true,
            },
          }),
        )
      })
    browser = await chromium.connectOverCDP(endpoints.renderer, { noDefaults: true })
    const context = browser.contexts()[0]
    return {
      evaluate,
      context: () => context,
      firstWindow: async () => context.pages()[0] || context.waitForEvent('page'),
      close: async () => {
        try {
          await evaluate(({ app }) => app.quit())
        } catch (error) {
          child.kill()
          throw error
        } finally {
          socket.close()
          await browser.close()
          await exited
        }
      },
    }
  } catch (error) {
    socket?.close()
    await browser?.close()
    child.kill()
    await exited
    throw error
  }
}
