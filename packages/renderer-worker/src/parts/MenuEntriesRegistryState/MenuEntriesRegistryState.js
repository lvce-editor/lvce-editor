const state = {
  idMap: Object.create(null),
  idMapByModuleId: Object.create(null),
}

export const register = (id, module, moduleId) => {
  const { idMap, idMapByModuleId } = state
  idMap[id] = module
  if (moduleId) {
    idMapByModuleId[id] ||= Object.create(null)
    idMapByModuleId[id][moduleId] = module
  }
}

export const get = (id) => {
  const { idMap } = state
  return idMap[id]
}

export const getForModuleId = (id, moduleId) => {
  const { idMapByModuleId } = state
  return idMapByModuleId[id]?.[moduleId] || get(id)
}
