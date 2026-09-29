import { beforeEach, expect, test } from '@jest/globals'
import * as MenuEntries from '../src/parts/MenuEntries/MenuEntries.js'
import * as MenuEntriesRegistryState from '../src/parts/MenuEntriesRegistryState/MenuEntriesRegistryState.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

const menuId = 9999

interface ViewletInstance {
  readonly factory: Record<string, never>
  readonly moduleId: string
  readonly renderedState: {
    readonly uid: number
  }
  readonly state: {
    readonly uid: number
  }
}

const createInstance = (uid: number, moduleId: string): ViewletInstance => {
  return {
    factory: {},
    moduleId,
    renderedState: {
      uid,
    },
    state: {
      uid,
    },
  }
}

beforeEach(() => {
  ViewletStates.reset()
})

test('getMenuEntries2 resolves duplicate menu ids by originating viewlet uid', async () => {
  MenuEntriesRegistryState.register(
    menuId,
    {
      getMenuEntries() {
        return ['search']
      },
    },
    'Extensions',
  )
  MenuEntriesRegistryState.register(
    menuId,
    {
      getMenuEntries() {
        return ['detail']
      },
    },
    'ExtensionDetail',
  )
  ViewletStates.set(1, createInstance(1, 'Extensions'))
  ViewletStates.set(2, createInstance(2, 'ExtensionDetail'))

  await expect(MenuEntries.getMenuEntries2(1, menuId)).resolves.toEqual(['search'])
  await expect(MenuEntries.getMenuEntries2(2, menuId)).resolves.toEqual(['detail'])
})
