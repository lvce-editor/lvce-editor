import { expect, test } from '@jest/globals'
import * as ViewletModuleMap from '../src/parts/ViewletModuleMap/ViewletModuleMap.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

test('diff editor uses worker-backed module', async () => {
  const module = await ViewletModuleMap.map[ViewletModuleId.DiffEditor]()

  expect(module.name).toBe('DiffEditor')
  expect(module.hasFunctionalRender).toBe(true)
  expect(typeof module.loadContent).toBe('function')
  expect(typeof module.saveState).toBe('function')
  expect(typeof module.Commands.setDeltaY).toBe('function')
  expect(typeof module.Commands.handleWheel).toBe('function')
})
