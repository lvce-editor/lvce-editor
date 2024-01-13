import * as AssetDir from '../AssetDir/AssetDir.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    x,
    y,
    width,
    height,
    iconSrc: '',
  }
}

export const loadContent = async (state) => {
  return {
    ...state,
    iconSrc: `${AssetDir.assetDir}/icons/icon.svg`,
  }
}
