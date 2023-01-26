export const sleep = (duration) => {
  const promiseCallback = (resolve, reject) => {
    setTimeout(resolve, duration)
  }
  return new Promise(promiseCallback)
}
