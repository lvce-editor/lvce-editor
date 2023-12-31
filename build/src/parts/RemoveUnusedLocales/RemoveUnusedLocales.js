import * as ReadDir from '../ReadDir/ReadDir.js'
import * as Remove from '../Remove/Remove.js'

const removeUnusedLocalesMacos = async ({ arch }) => {
  //  TODO
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

export const removeUnusedLocales = async ({ arch, isMacos }) => {
  if (isMacos) {
    return removeUnusedLocalesMacos({ arch })
  }
  return removeUnusedLocalesOther({ arch })
}
