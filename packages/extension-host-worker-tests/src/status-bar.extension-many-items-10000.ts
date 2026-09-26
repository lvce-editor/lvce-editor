import type { Test } from '@lvce-editor/test-with-playwright'
import { testManyStatusBarItems } from '../fixtures/sample.extension-many-status-bar-items/test.js'

export const name = 'status-bar.extension-many-items-10000'

export const test: Test = async (api) => testManyStatusBarItems(api, 10000)
