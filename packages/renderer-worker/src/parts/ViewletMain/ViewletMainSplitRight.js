const getNewGroups = (groups, x, y, width, height) => {
  const lastGroup = groups.at(-1)
  if (!lastGroup) {
  }
}

export const splitRight = (state) => {
  const { groups, x, y, width, height } = state
  const newGroups = getNewGroups(groups, x, y, width, height)
  // TODO
  return {
    newState: state,
    commands: [],
  }
}
