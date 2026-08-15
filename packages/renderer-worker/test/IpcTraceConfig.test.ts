import { expect, test } from '@jest/globals'
import * as IpcTraceConfig from '../src/parts/IpcTraceConfig/IpcTraceConfig.js'

test('parses comma-separated worker ids', () => {
  const options = IpcTraceConfig.parseTraceIpc(['/usr/bin/lvce', '--trace-ipc=builtin.eslint, builtin.eslint.evaluation-worker'])
  expect([...options.selectors]).toEqual(['builtin.eslint', 'builtin.eslint.evaluation-worker'])
  expect(options.error).toBe('')
})

test('parses a separate wildcard value', () => {
  const options = IpcTraceConfig.parseTraceIpc(['/usr/bin/lvce', '--trace-ipc', '*'])
  expect(IpcTraceConfig.shouldTrace(options.selectors, '')).toBe(true)
})

test('rejects an empty value', () => {
  const options = IpcTraceConfig.parseTraceIpc(['/usr/bin/lvce', '--trace-ipc='])
  expect(options.error).toBe('--trace-ipc requires a comma-separated worker id list or *')
})

test('does not consume the next cli flag as a worker id', () => {
  const options = IpcTraceConfig.parseTraceIpc(['/usr/bin/lvce', '--trace-ipc', '--verbose'])
  expect(options.error).toBe('--trace-ipc requires a comma-separated worker id list or *')
})

test('matches exact stable ids', () => {
  const options = IpcTraceConfig.parseTraceIpc(['/usr/bin/lvce', '--trace-ipc=builtin.eslint'])
  expect(IpcTraceConfig.shouldTrace(options.selectors, 'builtin.eslint')).toBe(true)
  expect(IpcTraceConfig.shouldTrace(options.selectors, 'builtin.eslint.evaluation-worker')).toBe(false)
})
