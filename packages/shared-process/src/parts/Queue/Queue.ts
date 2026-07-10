export const state: any = {
  queueMap: Object.create(null),
}

const run = async (queue: any): Promise<any> => {
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

export const add = async (key: any, fn: any): Promise<any> => {
  const queue = (state.queueMap[key] ||= {
    items: [],
    state: 'idle',
  })
  await new Promise((resolve: any, reject: any) => {
    queue.items.push({
      fn,
      reject,
      resolve,
    })
    run(queue)
  })
}
