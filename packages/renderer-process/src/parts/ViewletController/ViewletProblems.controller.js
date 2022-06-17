// create should be sync
// when async, its hard to cancel

export const create = () => {
  const state = {
    state: 'loading',
  }

  const update = () => {
    const problems = ['problem 1', 'problem 2']
  }

  const dispose = () => {
    // TODO remove listeners from shared process
  }

  return {
    id: 'ViewletProblems',
    update,
    dispose,
  }
}
