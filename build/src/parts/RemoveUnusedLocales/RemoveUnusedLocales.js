import * as ReadDir from '../ReadDir/ReadDir.js'
import * as Remove from '../Remove/Remove.js'

const shouldLocaleBeRemovedMacos = (dirent) => {
  if (!dirent.endsWith('.lproj')) {
    return false
  }
  if (dirent === 'en.lproj') {
    return false
  }
  return true
}

const removeUnusedLocalesMacos = async ({ arch, product }) => {
  const localesPath1 = `build/.tmp/electron-bundle/${arch}/${product.applicationName}.app/Contents/Resources`
  const dirents1 = await ReadDir.readDir(localesPath1)
  const toRemove1 = dirents1.filter(shouldLocaleBeRemovedMacos)
  for (const dirent of toRemove1) {
    await Remove.remove(`${localesPath1}/${dirent}`)
  }
  const localesPath2 = `build/.tmp/electron-bundle/${arch}/${product.applicationName}.app/Contents/Frameworks/Electron.Framework.framework/Versions/A/Resources`
  const dirents2 = await ReadDir.readDir(localesPath2)
  const toRemove2 = dirents2.filter(shouldLocaleBeRemovedMacos)
  for (const dirent of toRemove2) {
    await Remove.remove(`${localesPath2}/${dirent}`)
  }
}

const shouldLocaleBeRemovedOther = (locale) => {
  return locale !== 'en-US.pak'
}

const removeUnusedLocalesOther = async ({ arch }) => {
  const localesPath = `build/.tmp/electron-bundle/${arch}/locales`
  const dirents = await ReadDir.readDir(localesPath)
  const toRemove = dirents.filter(shouldLocaleBeRemovedOther)
  for (const dirent of toRemove) {
    await Remove.remove(`build/.tmp/electron-bundle/${arch}/locales/${dirent}`)
  }
}

export const removeUnusedLocales = async ({ arch, isMacos, product }) => {
  if (isMacos) {
    return removeUnusedLocalesMacos({ arch, product })
  }
  return removeUnusedLocalesOther({ arch })
}
