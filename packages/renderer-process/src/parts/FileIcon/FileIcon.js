export const create = (icon) => {
  const $FileIcon = document.createElement('div')
  $FileIcon.className = `FileIcon FileIcon${icon}`
  return $FileIcon
}

export const setIcon = ($Icon, icon) => {
  $Icon.className = `FileIcon FileIcon${icon}`
}
