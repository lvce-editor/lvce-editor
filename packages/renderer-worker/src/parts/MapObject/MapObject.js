export const mapObject = (object, fn) => {
  const mapFn = ([key, value]) => [key, fn(value)]
  return Object.fromEntries(Object.entries(object).map(mapFn))
}
