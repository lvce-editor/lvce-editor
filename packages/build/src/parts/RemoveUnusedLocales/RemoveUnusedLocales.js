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
  const localesPath2 = `build/.tmp/electron-bundle/${arch}/${product.applicationName}.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources`
  const localesPaths = [localesPath1, localesPath2]
  for (const localePath of localesPaths) {
    const dirents = await ReadDir.readDir(localePath)
    const toRemove = dirents.filter(shouldLocaleBeRemovedMacos)
    for (const dirent of toRemove) {
      await Remove.remove(`${localePath}/${dirent}`)
    }
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
