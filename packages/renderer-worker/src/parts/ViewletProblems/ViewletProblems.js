import * as ProblemsWorker from '../ProblemsWorker/ProblemsWorker.ts'

export const create = (id, uri, x, y, width, height, args, parentUid) => {
  return {
    uid: id,
    parentUid,
    x,
    y,
    width,
    height,
  }
}

export const loadContent = async (state, savedState) => {
  await ProblemsWorker.invoke('Problems.create', state.uid, state.uri, state.x, state.y, state.width, state.height)
  await ProblemsWorker.invoke('Problems.loadContent', state.uid, savedState)
  const diffResult = await ProblemsWorker.invoke('Problems.diff2', state.uid)
  const commands = await ProblemsWorker.invoke('Problems.render2', state.uid, diffResult)
  const actionsDom = await ProblemsWorker.invoke('Problems.renderActions', state.uid)

  return {
    ...state,
    commands,
    actionsDom,
  }
}

export const getBadgeCount = (state) => {
  // TODO
  return 0
}

export const hasFunctionalResize = true
