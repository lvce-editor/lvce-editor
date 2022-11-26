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
    changes.push([/* method */ 'setTodos', /* todos */ newState.todos])
  }
  return changes
}
