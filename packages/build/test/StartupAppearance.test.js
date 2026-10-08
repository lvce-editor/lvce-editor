import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'
import { expect, test } from '@jest/globals'

const startupScript = await readFile(new URL('../../../static/js/startupAppearance.js', import.meta.url), 'utf8')

const runStartupScript = (layoutValue, settingsValue = null) => {
  const classes = new Set()
  let observerCallback
  let disconnected = false
  const root = {
    classList: {
      add(value) {
        classes.add(value)
      },
      remove(value) {
        classes.delete(value)
      },
    },
  }
  const context = {
    localStorage: {
      getItem: (key) => (key === 'Layout' ? layoutValue : settingsValue),
    },
    document: {
      documentElement: root,
      querySelector: () => null,
    },
    MutationObserver: class {
      constructor(callback) {
        observerCallback = callback
      }
      observe() {}
      disconnect() {
        disconnected = true
      }
    },
  }
  runInNewContext(startupScript, context)
  return {
    classes,
    context,
    get disconnected() {
      return disconnected
    },
    notifyMutation() {
      observerCallback?.()
    },
  }
}

test('applies the startup surface before the AI-native workbench is restored', () => {
  const startup = runStartupScript('{"aiNativeLayout":true}')

  expect(startup.classes.has('AiNativeLayoutStartup')).toBe(true)
  expect(startup.disconnected).toBe(false)
})

test('uses the saved Claude background before the AI-native workbench is restored', () => {
  const startup = runStartupScript('{"aiNativeLayout":true}', '{"chat2.aiNativeTheme":"claude"}')

  expect(startup.classes.has('AiNativeLayoutStartup')).toBe(true)
  expect(startup.classes.has('AiNativeLayoutStartupClaude')).toBe(true)
})

test('removes the startup surface when the AI-native workbench is ready', () => {
  const startup = runStartupScript('{"aiNativeLayout":true}')
  startup.context.document.querySelector = () => ({})

  startup.notifyMutation()

  expect(startup.classes.has('AiNativeLayoutStartup')).toBe(false)
  expect(startup.disconnected).toBe(true)
})

test.each([null, '{"aiNativeLayout":false}', '{"aiNativeLayout":"true"}', 'invalid'])('ignores a missing or invalid saved layout: %s', (value) => {
  const startup = runStartupScript(value)

  expect(startup.classes.has('AiNativeLayoutStartup')).toBe(false)
})

test('ignores a storage access error', () => {
  const startup = runStartupScript(null)
  startup.context.localStorage.getItem = () => {
    throw new Error('storage unavailable')
  }

  expect(() => runInNewContext(startupScript, startup.context)).not.toThrow()
  expect(startup.classes.has('AiNativeLayoutStartup')).toBe(false)
})
