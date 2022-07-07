export const activate = async (path) => {
  console.log('activating ', path)
  try {
    await import(path)
  } catch (error) {
    throw new Error(`Failed to activate extension`, {
      // @ts-ignore
      cause: error,
    })
  }
  console.info('activated', path)
}
