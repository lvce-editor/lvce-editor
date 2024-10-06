export const serializeInstance = (instance) => {
  if (instance && instance.factory && instance.factory.saveState) {
    return instance.factory.saveState(instance.state)
  }
  return undefined
}

export const serializeInstances = (instances) => {
  const serialized = Object.create(null)
  for (const value of Object.values(instances)) {
    const serializedInstance = serializeInstance(value)
    if (serializedInstance) {
      const storageKey = value.factory.StorageKey || value.moduleId
      serialized[storageKey] = serializedInstance
    }
  }
  return serialized
}
