import * as ViewletTodoList from '../src/parts/ViewletTodoList/ViewletTodoList.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

test('create', () => {
  expect(ViewletTodoList.create()).toBeDefined()
})

test('addTodo', () => {
  const state = ViewletTodoList.create()
  expect(ViewletTodoList.addTodo(state, { id: 1, text: 'test' })).toMatchObject(
    {
      todos: [{ id: 1, text: 'test' }],
    }
  )
})

test('render', () => {
  const oldState = ViewletTodoList.create()
  const newState = {
    ...oldState,
    todos: [{ id: 1, text: 'test' }],
  }
  expect(ViewletTodoList.render(oldState, newState)).toEqual([
    ['setTodos', [{ id: 1, text: 'test' }]],
  ])
})
