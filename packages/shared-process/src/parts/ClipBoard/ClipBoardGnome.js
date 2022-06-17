// see https://www.cyberciti.biz/faq/how-do-i-copy-a-file-to-the-clipboard-in-linux
// see also http://manpages.ubuntu.com/manpages/bionic/man1/xclip.1.html
// on gnome, get current selection targets with `xclip -selection clipboard -t TARGETS -o`

import VError from 'verror'
import * as Exec from '../Exec/Exec.js'

const removePrefix = (file) => {
  if (file.startsWith('file://')) {
    return file.slice('file://'.length)
  }
  return file
}

const addPrefix = (file) => {
  return `file://${file}`
}

export const readFiles = async () => {
  let result
  try {
    result = await Exec.exec(
      'xclip',
      ['-selection', 'clipboard', '-o', '-t', 'x-special/gnome-copied-files'],
      {}
    )
  } catch (error) {
    if (
      error &&
      // @ts-ignore
      error.stderr ===
        'Error: target x-special/gnome-copied-files not available'
    ) {
      return
    }
    throw error
  }
  const [type, ...files] = result.stdout.split('\n')
  const actualFiles = files.map(removePrefix)
  return {
    source: 'gnomeCopiedFiles',
    type,
    files: actualFiles,
  }
}

export const writeFiles = async (type, files) => {
  const filesWithPrefix = files.map(addPrefix)
  const gnomeCopiedFilesContent = [type, ...filesWithPrefix].join('\n')
  const uriListContent = filesWithPrefix.join('\n')
  const plainContent = files.join('\n')
  try {
    await Exec.exec(
      'xclip',
      ['-i', '-selection', 'clipboard', '-t', 'x-special/gnome-copied-files'],
      {
        input: gnomeCopiedFilesContent,
      }
    )
    await Exec.exec(
      'xclip',
      ['-i', '-selection', 'clipboard', '-t', 'text/uri-list'],
      {
        input: uriListContent,
      }
    )
    await Exec.exec(
      'xclip',
      ['-i', '-selection', 'clipboard', '-t', 'text/plain'],
      {
        input: plainContent,
      }
    )
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to copy files to clipboard')
  }
}
