const Assert = require('../Assert/Assert.js')
const Id = require('../Id/Id.js')

const state = (exports.state = {
  callbacks: Object.create(null),
})

exports.registerPromise = () => {
  const id = Id.create()
  const promise = new Promise((resolve, reject) => {
    state.callbacks[id] = {
      resolve,
      reject,
    }
  })
  return { id, promise }
}

exports.unregister = (id) => {
  delete state.callbacks[id]
}

exports.resolve = (id, args) => {
  Assert.number(id)
  if (!(id in state.callbacks)) {
    console.log(args)
    console.warn(`callback ${id} may already be disposed`)
    return
  }
  state.callbacks[id].resolve(args)
  delete state.callbacks[id]
}

exports.reject = (id, error) => {
  Assert.number(id)
  if (!(id in state.callbacks)) {
    console.warn(`callback ${id} may already be disposed`)
    return
  }
  state.callbacks[id].reject(error)
  delete state.callbacks[id]
}
