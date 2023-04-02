export const walkDependencies = (object, fn) => {
  const shouldContinue = fn(object)
  if (!shouldContinue) {
    return
  }
  if (!object.dependencies) {
    if (!object._dependencies) {
      return
    }
    const hiddenDependencies = Object.keys(object._dependencies)
    for (const hiddenDependency of hiddenDependencies) {
      walkDependencies(
        {
          path: object.path.slice(0, -object.name.length) + hiddenDependency,
          name: hiddenDependency,
        },
        fn
      )
    }
    return
  }
  const visibleDependencies = Object.values(object.dependencies)
  for (const value of visibleDependencies) {
    walkDependencies(value, fn)
  }
}
