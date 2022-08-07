import * as ViewletTodoList from '../src/parts/ViewletTodoList/ViewletTodoList.js'

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
    ['Viewlet.send', 'TodoList', 'setTodos', [{ id: 1, text: 'test' }]],
  ])
})
