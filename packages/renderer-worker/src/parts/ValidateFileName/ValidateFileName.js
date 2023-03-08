// based on https://github.com/microsoft/vscode/blob/721fbe6f01f23270778cdeec39a993688952c9b3/src/vs/workbench/contrib/files/browser/fileActions.ts#L685 by Microsoft (License MIT)
import * as I18nString from '../I18NString/I18NString.js'
import * as IsWhitespace from '../IsWhitespace/IsWhitespace.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'
import * as Severity from '../Severity/Severity.js'
import * as StartsOrEndsWithWhitespace from '../StartsOrEndsWithWhitespace/StartsOrEndsWithWhitespace.js'

/**
 * @enum {string}
 */
const UiStrings = {
  EmptyFileNameError: 'A file or folder name must be provided.',
  FileNameStartsWithSlashError: `A file or folder name cannot start with a slash.`,
  FileNameExistsError: 'A file or folder **{0}** already exists at this location. Please choose a different name.',
  FileNameWhitespaceWarning: 'Leading or trailing whitespace detected in file or folder name.',
  InvalidFileNameError: 'The name **{0}** is not valid as a file or folder name. Please choose a different name.',
}

const RE_SLASH_OR_BACKSLASH = /[\\/]/

const getPathParts = (path) => {
  return path.split(RE_SLASH_OR_BACKSLASH)
}

export const validateFileName = (name) => {
  console.log({ name })
  if (!name || name.length === 0 || IsWhitespace.isWhitespace(name)) {
    console.log('empty file name error')
    return {
      content: I18nString.i18nString(UiStrings.EmptyFileNameError),
      severity: Severity.Error,
    }
  }
  if (name[0] === PathSeparatorType.Slash || name[0] === PathSeparatorType.Backslash) {
    return {
      content: I18nString.i18nString(UiStrings.FileNameStartsWithSlashError),
      severity: Severity.Error,
    }
  }
  const names = getPathParts(name)
  // const parent = item.parent

  // if (name !== item.name) {
  //   const child = parent?.getChild(name)
  //   if (child && child !== item) {
  //     return {
  //       content: I18nString.i18nString(UiStrings.FileNameExistsError),
  //       severity: Severity.Error,
  //     }
  //   }
  // }
  // if (names.some((folderName) => !pathService.hasValidBasename(item.resource, os, folderName))) {
  //   return {
  //     content: I18nString.i18nString(UiStrings.InvalidFileNameError),
  //     severity: Severity.Error,
  //   }
  // }
  if (names.some(StartsOrEndsWithWhitespace.startsOrEndsWithWhitespace)) {
    return {
      content: I18nString.i18nString(UiStrings.FileNameWhitespaceWarning),
      severity: Severity.Warning,
    }
  }
  return {
    content: '',
    severity: Severity.None,
  }
}
