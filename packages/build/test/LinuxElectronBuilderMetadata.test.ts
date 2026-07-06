import { describe, expect, test } from '@jest/globals'
import { readFile } from 'node:fs/promises'

const defaultReplacements: Record<string, string> = {
  '@@ASAR@@': 'false',
  '@@AUTHOR@@': 'LVCE Editor',
  '@@ELECTRON_VERSION@@': '42.0.0',
  '@@HOMEPAGE@@': 'https://example.com',
  '@@LICENSE@@': 'MIT',
  '@@MAC_BUNDLE_ID@@': 'com.lvceeditor.lvce',
  '@@MAIN@@': 'packages/main-process/src/mainProcessMain.js',
  '@@NAME@@': 'lvce-editor',
  '@@NAME_LONG@@': 'Lvce Editor',
  '@@PRODUCT_NAME@@': 'Lvce Editor',
  '@@SNAP_NAME@@': 'lvce-editor',
  '@@VERSION@@': '1.0.0',
  '@@WINDOWS_EXECUTABLE_NAME@@': 'Lvce Editor',
}

const renderTemplate = async (name: string) => {
  const url = new URL(`../src/parts/Template/template_${name}.txt`, import.meta.url)
  let template = await readFile(url, 'utf8')
  for (const [key, value] of Object.entries(defaultReplacements)) {
    template = template.replaceAll(key, value)
  }
  return JSON.parse(template)
}

const electronBuilderTemplates = [
  'electron_builder_deb',
  'electron_builder_arch_linux',
  'electron_builder_app_image',
  'electron_builder_snap',
  'electron_builder_mac',
  'electron_builder_windows_exe',
]

describe('electron-builder metadata', () => {
  test.each(electronBuilderTemplates)('%s omits removed schema fields', async (templateName) => {
    const json = await renderTemplate(templateName)

    expect(json.build).not.toHaveProperty('includeSubNodeModules')
  })
})

describe('linux electron-builder metadata', () => {
  test.each(['electron_builder_deb', 'electron_builder_arch_linux', 'electron_builder_app_image', 'electron_builder_snap'])(
    '%s defines stable product and desktop metadata',
    async (templateName) => {
      const json = await renderTemplate(templateName)

      expect(json.productName).toBe('Lvce Editor')
      expect(json.desktopName).toBe('lvce-editor.desktop')
      expect(json.build.icon).toBe('./build/icons/')
      expect(json.build.linux.executableName).toBe('lvce-editor')
      expect(json.build.linux.desktop.StartupWMClass).toBe('Lvce Editor')
    },
  )
})

describe('mac electron-builder metadata', () => {
  test('defines signing and notarization metadata', async () => {
    const json = await renderTemplate('electron_builder_mac')

    expect(json.build.appId).toBe('com.lvceeditor.lvce')
    expect(json.build.mac.target).toBe('dmg')
    expect(json.build.mac.category).toBe('public.app-category.developer-tools')
    expect(json.build.mac.hardenedRuntime).toBe(true)
    expect(json.build.mac.notarize).toBe(true)
    expect(json.build.mac.entitlements).toBe('build/entitlements.mac.plist')
    expect(json.build.mac.entitlementsInherit).toBe('build/entitlements.mac.inherit.plist')
  })
})
