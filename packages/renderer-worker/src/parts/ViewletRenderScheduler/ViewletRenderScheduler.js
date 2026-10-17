import * as IsTest from '../IsTest/IsTest.js'
import * as RequestAnimationFrame from '../RequestAnimationFrame/RequestAnimationFrame.js'

let pending = new Map()
let tail = Promise.resolve()
let scheduled = false

const waitForFrame = () => {
  if (IsTest.isTest()) {
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    let settled = false
    let frameId
    const finish = () => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      RequestAnimationFrame.cancelAnimationFrame(frameId)
      resolve(undefined)
    }
    // Worker frames may be suspended while the window is occluded.
    const timer = setTimeout(finish, 100)
    frameId = RequestAnimationFrame.requestAnimationFrame(finish)
  })
}

const flush = async () => {
  await waitForFrame()
  const requests = pending
  pending = new Map()
  scheduled = false
  // Remove the snapshot before invoking workers: later notifications belong to
  // the next frame, even when they refer to a view currently being rendered.
  await Promise.allSettled(
    [...requests.values()].map(async ({ render, resolve, reject }) => {
      try {
        resolve(await render())
      } catch (error) {
        reject(error)
      }
    }),
  )
}

export const schedule = (instance, render) => {
  const existing = pending.get(instance)
  if (existing) {
    return existing.promise
  }
  const { promise, resolve, reject } = Promise.withResolvers()
  pending.set(instance, { promise, reject, render, resolve })
  if (!scheduled) {
    scheduled = true
    // This queue is separate from the renderer RPC queue. Rendering can invoke
    // renderer RPCs, so holding that queue while awaiting workers would deadlock.
    tail = tail.then(flush)
  }
  return promise
}
