import { expect, test } from '@jest/globals'
import * as GetWorkspaceScopedViewletStates from '../src/parts/GetWorkspaceScopedViewletStates/GetWorkspaceScopedViewletStates.js'

test('namespaces viewlet states while preserving global layout state', () => {
  const instances = {
    Explorer: { expandedPaths: ['/workspace/src'] },
    Layout: { points: [1, 2, 3] },
    Main: { groups: [] },
  }

  const result = GetWorkspaceScopedViewletStates.getWorkspaceScopedViewletStates(instances, '/workspace')

  expect(result).toEqual({
    'viewlet:%2Fworkspace:Explorer': instances.Explorer,
    Layout: instances.Layout,
    'viewlet:%2Fworkspace:Main': instances.Main,
  })
})
