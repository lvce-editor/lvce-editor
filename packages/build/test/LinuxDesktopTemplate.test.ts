import { describe, expect, test } from '@jest/globals'
import { readFile } from 'node:fs/promises'

const defaultReplacements: Record<string, string> = {
  '@@APPLICATION_NAME@@': 'lvce',
  '@@EXEC@@': 'lvce %U',
  '@@ICON@@': 'lvce',
  '@@KEYWORDS@@': 'lvce;',
  '@@NAME@@': 'lvce',
  '@@NAME_LONG@@': 'Lvce Editor',
  '@@NAME_SHORT@@': 'Lvce',
  '@@SUMMARY@@': 'Code Editor',
  '@@URL_PROTOCOL@@': 'lvce',
}

const renderTemplate = async (name: string) => {
  const url = new URL(`../src/parts/Template/template_${name}.txt`, import.meta.url)
  let template = await readFile(url, 'utf8')
  for (const [key, value] of Object.entries(defaultReplacements)) {
    template = template.replaceAll(key, value)
  }
  return template
}

describe('linux desktop template', () => {
  test('uses application name for GNOME window matching', async () => {
    const desktopFile = await renderTemplate('linux_desktop')

    expect(desktopFile).toContain('StartupWMClass=lvce')
    expect(desktopFile).toContain('X-GNOME-WMClass=lvce')
  })
})
