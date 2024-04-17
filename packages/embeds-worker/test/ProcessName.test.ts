import * as ProcessName from '../src/parts/ProcessName/ProcessName.ts'
import { test, expect } from '@jest/globals'

test('processName', () => {
  expect(ProcessName.processName).toBe('embeds-worker')
})
