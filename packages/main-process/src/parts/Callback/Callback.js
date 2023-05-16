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

exports.resolve = (id, args) => {
  Assert.number(id)
  const { callbacks } = state
  if (!(id in callbacks)) {
    console.log(args)
    console.warn(`callback ${id} may already be disposed`)
    return
  }
  callbacks[id].resolve(args)
  delete callbacks[id]
}
