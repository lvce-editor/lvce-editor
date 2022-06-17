export const state = {
  queueMap: Object.create(null),
}

const run = async (queue) => {
  if (queue.state === 'running') {
    return
  }
  queue.state = 'running'
  let item
  while ((item = queue.items.shift())) {
    try {
      await item.fn()
      item.resolve()
    } catch (error) {
      item.reject(error)
    }
  }
  queue.state = 'idle'
}

export const add = async (key, fn) => {
  const queue = (state.queueMap[key] ||= {
    state: 'idle',
    items: [],
  })
  await new Promise((resolve, reject) => {
    queue.items.push({
      fn,
      resolve,
      reject,
    })
    run(queue)
  })
}
