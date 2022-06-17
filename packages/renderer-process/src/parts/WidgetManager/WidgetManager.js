export const state = Object.create(null)

export const deleteState = (id) => {
  delete state[id]
}

export const setState = (id, widgetState) => {
  widgetState[id] = widgetState
}

export const getState = (id) => {
  return state[id]
}

const getModule = (id) => {
  switch (id) {
    case 'SideBar':
      return import('../SideBar/SideBar.js')
    case 'TitleBar':
      return import('../TitleBar/TitleBar.js')
    default:
      throw new Error('not found')
  }
}

export const create = async (id) => {
  const factory = await getModule(id)
  const widgetState = factory.create()
  state[id] = widgetState
}
