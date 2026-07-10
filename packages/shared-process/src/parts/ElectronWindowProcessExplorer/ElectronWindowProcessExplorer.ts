import { writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as ColorTheme from '../ColorTheme/ColorTheme.ts'
import * as GetProcessExplorerUrl from '../GetProcessExplorerUrl/GetProcessExplorerUrl.ts'
import * as ParentIpc from '../MainProcess/MainProcess.ts'
import * as PreloadUrl from '../PreloadUrl/PreloadUrl.ts'

const getOptions = async (colorThemeJson: any): Promise<any> => {
  const backgroundColor = colorThemeJson.MainBackground
  const preload = PreloadUrl.getPreloadUrl()
  const options = {
    backgroundColor,
    height: 500,
    webPreferences: {
      additionalArguments: ['--lvce-window-kind=process-explorer'],
      preload,
      sandbox: true,
      spellcheck: false,
    },
    width: 800,
  }
  return options
}

export const open = async (): Promise<any> => {
  const colorThemeJson = await ColorTheme.getColorThemeJson()
  const options = await getOptions(colorThemeJson)
  // TODO get actual process explorer theme css from somewhere
  const processExplorerThemeCss = ColorTheme.toCss(colorThemeJson)
  const processExporerThemeCssPath = join(tmpdir(), 'process-explorer-theme.css')
  await writeFile(processExporerThemeCssPath, processExplorerThemeCss)
  const url = GetProcessExplorerUrl.getProcessExplorerUrl()
  return ParentIpc.invoke('ElectronWindowProcessExplorer.open2', options, url)
}
