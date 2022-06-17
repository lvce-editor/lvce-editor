export const name = 'TodoList'

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
      /* Viewlet.send */ 3024,
      /* id */ 'TodoList',
      /* method */ 'setTodos',
      /* todos */ newState.todos,
    ])
  }
  return changes
}
