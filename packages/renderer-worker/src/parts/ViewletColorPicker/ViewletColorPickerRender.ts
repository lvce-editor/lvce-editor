import type { ColorPickerState } from './ViewletColorPickerTypes.ts'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderAll = {
  isEqual(oldState: ColorPickerState, newState: ColorPickerState) {
    return newState.commands && newState.commands.length === 0
  },
  apply(oldState: ColorPickerState, newState: ColorPickerState) {
    const commands = newState.commands
    newState.commands = []
    if (!commands) {
      return []
    }
    const adjustedCommands = commands.map((command) => {
      if (command[0] === 'Viewlet.setDom2') {
        return ['Viewlet.setDom2', newState.uid, ...command.slice(1)]
      }
      return ['Viewlet.send', newState.uid, ...command]
    })
    console.log({ adjustedCommands })
    return adjustedCommands
  },
  multiple: true,
}

export const render = [renderAll]
