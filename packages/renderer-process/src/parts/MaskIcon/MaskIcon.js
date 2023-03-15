import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as MaskImage from '../MaskImage/MaskImage.js'

export const create = (icon) => {
  const $Icon = document.createElement('div')
  $Icon.className = 'MaskIcon'
  MaskImage.setMaskImage($Icon, icon)
  // @ts-ignore
  $Icon.role = AriaRoles.None
  return $Icon
}
