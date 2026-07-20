import { expect, test } from '@jest/globals'
import * as ModuleId from '../src/parts/ModuleId/ModuleId.js'
import * as ModuleMap from '../src/parts/ModuleMap/ModuleMap.js'

test('getModuleId - Platform.getConfigJsonPath', () => {
  expect(ModuleMap.getModuleId('Platform.getConfigJsonPath')).toBe(ModuleId.Platform)
})
