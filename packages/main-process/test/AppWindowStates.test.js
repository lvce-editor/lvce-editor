import * as AppWindowStates from '../src/parts/AppWindowStates/AppWindowStates.js'

beforeEach(() => {
  AppWindowStates.state.windowStates = []
})

test('add', () => {
  AppWindowStates.add({
    parsedArgs: [],
    workingDirectory: '',
    id: 1,
    windowId: 2,
  })
  expect(AppWindowStates.getAll()).toEqual([
    {
      parsedArgs: [],
      workingDirectory: '',
      id: 1,
      windowId: 2,
    },
  ])
})

test('findById', () => {
  AppWindowStates.add({
    parsedArgs: [],
    workingDirectory: '',
    id: 1,
    windowId: 2,
  })
  expect(AppWindowStates.findByWindowId(2)).toEqual({
    parsedArgs: [],
    workingDirectory: '',
    id: 1,
    windowId: 2,
  })
})

test('findById - not found', () => {
  AppWindowStates.add({
    parsedArgs: [],
    workingDirectory: '',
    id: 1,
    windowId: 2,
  })
  expect(AppWindowStates.findByWindowId(3)).toBeUndefined()
})

test('remove', () => {
  AppWindowStates.add({
    parsedArgs: [],
    workingDirectory: '',
    id: 1,
    windowId: 2,
  })
  AppWindowStates.remove(2)
  expect(AppWindowStates.getAll()).toEqual([])
})
