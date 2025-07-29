// TODO instead of reordering commands, have two command arrays
// one for normal commands
// and another for commands that should be executed after render (like setting scrolltop or
// setting focus)
export const reorderCommands = (allCommands) => {
  allCommands = [...allCommands]
  const scrollIndex = allCommands.findIndex((command) => command[0] === 'Viewlet.setProperty' && command['3'] === 'scrollTop')
  if (scrollIndex !== -1) {
    const command = allCommands[scrollIndex]
    allCommands.splice(scrollIndex, 1)

    // scrolling needs to come once elements are mounted
    allCommands.push(command)
  } else {
  }
  return allCommands
}
