/**
 *
 * @param {MouseEvent} event
 */
export const handleTitleBarButtonsClick = (event) => {
  const { target } = event
  return ['handleClick', target.className]
}

export const returnValue = true
