import { writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as ColorTheme from '../ColorTheme/ColorTheme.js'
import * as PreloadUrl from '../PreloadUrl/PreloadUrl.js'
import * as GetProcessExplorerUrl from '../GetProcessExplorerUrl/GetProcessExplorerUrl.js'
import * as ParentIpc from '../MainProcess/MainProcess.js'

const getOptions = async (colorThemeJson) => {
  const backgroundColor = colorThemeJson.MainBackground
  const preload = PreloadUrl.getPreloadUrl()
  const options = {
    width: 800,
    height: 500,
    backgroundColor,
    webPreferences: {
      preload,
      sandbox: true,
      additionalArguments: ['--lvce-window-kind=process-explorer'],
      spellcheck: false,
    },
  }
  return options
}

export const open = async () => {
  const colorThemeJson = await ColorTheme.getColorThemeJson()
  const options = await getOptions(colorThemeJson)
  // TODO get actual process explorer theme css from somewhere
  const processExplorerThemeCss = ColorTheme.toCss(colorThemeJson)
  const processExporerThemeCssPath = join(tmpdir(), 'process-explorer-theme.css')
  await writeFile(processExporerThemeCssPath, processExplorerThemeCss)
  const url = GetProcessExplorerUrl.getProcessExplorerUrl()
  return ParentIpc.invoke('ElectronWindowProcessExplorer.open2', options, url)
}
