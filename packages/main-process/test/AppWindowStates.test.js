const AppWindowStates = require('../src/parts/AppWindowStates/AppWindowStates.js')

beforeEach(() => {
  AppWindowStates.state.windowStates = []
})

test('add', () => {
  AppWindowStates.add({
    parsedArgs: [],
    workingDirectory: '',
    id: 1,
  })
  expect(AppWindowStates.getAll()).toEqual([
    {
      parsedArgs: [],
      workingDirectory: '',
      id: 1,
    },
  ])
})

test('findById', () => {
  AppWindowStates.add({
    parsedArgs: [],
    workingDirectory: '',
    id: 1,
  })
  expect(AppWindowStates.findById(1)).toEqual({
    parsedArgs: [],
    workingDirectory: '',
    id: 1,
  })
})

test('findById - not found', () => {
  AppWindowStates.add({
    parsedArgs: [],
    workingDirectory: '',
    id: 1,
  })
  expect(AppWindowStates.findById(2)).toBeUndefined()
})

test('remove', () => {
  AppWindowStates.add({
    parsedArgs: [],
    workingDirectory: '',
    id: 1,
  })
  AppWindowStates.remove(1)
  expect(AppWindowStates.getAll()).toEqual([])
})
