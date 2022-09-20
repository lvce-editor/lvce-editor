import * as Command from '../Command/Command.js'

export const name = 'goToLine'

export const getPlaceholder = () => {
  return ''
}

export const getHelpEntries = () => {
  return []
}

export const getNoResults = () => {
  return undefined
}

export const getPicks = async () => {
  const picks = [
    {
      label: '1',
    },
    {
      label: '2',
    },
    {
      label: '3',
    },
    {
      label: '4',
    },
    {
      label: '5',
    },
    {
      label: '6',
    },
  ]
  return picks
}

export const selectPick = async (item) => {
  const rowIndex = Number.parseInt(item.label)
  const position = {
    rowIndex,
    columnIndex: 5,
  }
  await Command.execute(
    /* EditorSetCursor.editorSetCursor */ 396,
    /* position */ position
  )
  // TODO put cursor onto that line
  return {
    command: 'hide',
  }
}

export const getFilterValue = (value) => {
  return value
}
