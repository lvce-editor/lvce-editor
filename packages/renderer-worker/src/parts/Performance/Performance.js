export const mark = (id) => {
  performance.mark(id)
}

export const measure = (measureName, start, end) => {
  performance.measure(measureName, start, end)
}

export const getEntriesByType = (type) => {
  return performance.getEntriesByType(type)
}

export const timeOrigin = performance.timeOrigin
