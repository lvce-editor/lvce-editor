export const serializeInstance = (instance) => {
  if (instance && instance.factory && instance.factory.saveState) {
    return instance.factory.saveState(instance.state)
  }
  return undefined
}

export const serializeInstances = async (instances) => {
  const serialized = Object.create(null)
  // TODO make it parallel
  for (const value of Object.values(instances)) {
    const serializedInstance = await serializeInstance(value)
    if (serializedInstance) {
      const storageKey = value.factory.StorageKey || value.moduleId
      serialized[storageKey] = serializedInstance
    }
  }
  return serialized
}
