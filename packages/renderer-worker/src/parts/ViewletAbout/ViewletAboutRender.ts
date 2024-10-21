import type { AboutState } from './ViewletAboutTypes.ts'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const renderDialog = {
  isEqual(oldState: AboutState, newState: AboutState) {
    return newState.commands.length > 0
  },
  apply(oldState: AboutState, newState: AboutState) {
    const commands = newState.commands
    // @ts-ignore
    newState.commands = []
    console.log({ commands })
    return commands
  },
  multiple: true,
}

export const render = [renderDialog]
