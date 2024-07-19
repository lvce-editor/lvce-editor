import * as ViewletQuickPickStrings from '../ViewletQuickPick/ViewletQuickPickStrings.js'

// TODO probably not needed

export const getPlaceholder = () => {
  return ViewletQuickPickStrings.typeNameofCommandToRun()
}

export const getHelpEntries = () => {
  return undefined
}

// @ts-ignore
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
  //   command: QuickPickReturnValue.Hide,
  // }
}

export const getFilterValue = (value) => {
  return value
}
