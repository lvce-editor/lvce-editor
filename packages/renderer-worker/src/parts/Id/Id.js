export const state = {
  id: 0,
}

export const create = () => {
  const { start } = reserve(1)
  return start
}

// Reserve disjoint integer ranges for workers that create components locally.
// Ranges are never recycled, including after a worker or application restart.
export const reserve = (count) => {
  if (!Number.isSafeInteger(count) || count <= 0 || count > Number.MAX_SAFE_INTEGER - state.id) {
    throw new Error('Invalid or exhausted component id range')
  }
  const start = state.id + 1
  state.id += count
  return { start, end: state.id }
}
