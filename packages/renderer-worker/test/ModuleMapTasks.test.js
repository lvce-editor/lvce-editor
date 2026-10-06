import { expect, test } from '@jest/globals'
import * as ModuleId from '../src/parts/ModuleId/ModuleId.js'
import * as ModuleMap from '../src/parts/ModuleMap/ModuleMap.js'

test('task commands load from the task worker module', () => {
  expect(ModuleMap.getModuleId('Tasks.runDefaultBuildTask')).toBe(ModuleId.Tasks)
})
