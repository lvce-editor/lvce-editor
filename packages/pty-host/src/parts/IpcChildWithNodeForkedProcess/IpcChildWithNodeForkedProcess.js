let called = false
export const listen = async () => {
  console.trace('listen')
  if (!process.send) {
    throw new Error('process ipc is not available')
  }
  process.send('ready')
  console.count('pty ready')
  if (called) {
    throw new Error('relady called')
  }
  called = true
  process.on('message', (x) => {
    console.log('pty host msg now')
  })
  return process
}

export const wrap = (process) => {
  return {
    process,
    on(event, listener) {
      console.trace('add event listenr')
      this.process.on(event, listener)
    },
    off(event, listener) {
      this.process.off(event, listener)
    },
    send(message) {
      this.process.send(message)
    },
    dispose() {},
  }
}
