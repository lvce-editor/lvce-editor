export const mark = (id) => {
  performance.mark(id)
}

export const measure = (measureName, start, end) => {
  performance.measure(measureName, start, end)
}
