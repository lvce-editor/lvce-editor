export const create = (icon) => {
  const $FileIcon = document.createElement('img')
  $FileIcon.alt = ''
  $FileIcon.className = `FileIcon FileIcon${icon}`
  return $FileIcon
}

export const setIcon = ($Icon, icon) => {
  $Icon.src = icon
}
