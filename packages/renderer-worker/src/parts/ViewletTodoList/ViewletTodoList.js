import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const name = ViewletModuleId.TodoList

export const create = () => {
  return {
    todos: [],
  }
}

export const addTodo = (state, todo) => {
  return {
    ...state,
    todos: [...state.todos, todo],
  }
}

export const hasFunctionalRender = true

export const render = (oldState, newState) => {
  const changes = []
  if (oldState.todos !== newState.todos) {
    changes.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'TodoList',
      /* method */ 'setTodos',
      /* todos */ newState.todos,
    ])
  }
  return changes
}
