import * as ViewletTodoList from '../src/parts/Viewlet/ViewletTodoList.js'

test('name', () => {
  expect(ViewletTodoList.name).toBe('TodoList')
})

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
    [3024, 'TodoList', 'setTodos', [{ id: 1, text: 'test' }]],
  ])
})
