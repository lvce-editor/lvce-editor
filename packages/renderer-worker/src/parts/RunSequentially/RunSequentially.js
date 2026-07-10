export const runSequentially = async (actions, ...args) => {
  for (const action of actions) {
    await action(...args)
  }
}
