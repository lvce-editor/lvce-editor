import { expect, test } from '@jest/globals'
import * as SerializeViewlet from '../src/parts/SerializeViewlet/SerializeViewlet.js'

test('serializeInstances keeps viewlet instances with distinct storage keys isolated', async () => {
  const factory = {
    getStorageKey: (state) => state.uri,
    saveState: (state) => ({ value: state.value }),
  }
  const instances = {
    1: {
      factory,
      moduleId: 'Search',
      state: { uri: 'search-editor://1/Search', value: 'needle' },
    },
    2: {
      factory,
      moduleId: 'Search',
      state: { uri: 'search-editor://2/Search', value: 'alpha' },
    },
  }

  await expect(SerializeViewlet.serializeInstances(instances)).resolves.toEqual({
    'search-editor://1/Search': { value: 'needle' },
    'search-editor://2/Search': { value: 'alpha' },
  })
})
