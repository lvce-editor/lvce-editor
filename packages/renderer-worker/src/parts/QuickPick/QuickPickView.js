// TODO probably not needed

export const getPlaceholder = () => {
  return 'Type the name of a view, output channel or terminal to open.'
}

export const getHelpEntries = () => {
  return undefined
}

const toPick = (view) => ({
  label: view,
})

export const getPicks = async () => {
  // const views = ViewService.getViews()
  // const picks = views.map(toPick)
  // return picks
  return []
}

export const selectPick = async (item) => {
  // Command.execute(/* openView */ 549, /* viewName */ item.label)
  // return {
  //   command: 'hide',
  // }
}

export const getFilterValue = (value) => {
  return value
}
