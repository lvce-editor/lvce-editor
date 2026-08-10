import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@jest/globals'
import { bundleCss } from '../src/parts/BundleCss/BundleCss.ts'

test('bundleCss adds filename comment to generated part css files', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'parts', 'Markdown.css'), 'utf8')

    expect(css.startsWith('/* Markdown.css */\n')).toBe(true)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss does not add filename comment to App.css', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'App.css'), 'utf8')

    expect(css.startsWith('/* App.css */\n')).toBe(false)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss preserves the simple browser preview width', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'parts', 'ViewletSimpleBrowser.css'), 'utf8')

    expect(css).toContain(`.ContentArea > .SimpleBrowser {
  flex: 0 0 var(--PreviewWidth);
}`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss keeps the preview sash transparent', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'App.css'), 'utf8')

    expect(css).toContain(`.Sash {
  position: absolute;
  contain: strict;
  padding: 0;
  margin: 0;
  border: 0;
  z-index: 1;
  background: transparent;
  display: flex;
}`)
    expect(css).toContain(`.SashPreview {
  left: var(--SashPreviewLeft);
}`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss keeps the panel and panel sash within the non-preview area', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'App.css'), 'utf8')

    expect(css).toContain('contain: size layout style;')
    expect(css).toContain(`.Panel {
  background: var(--PanelBackground);
  height: var(--PanelHeight);
  width: var(--PanelWidth);
}`)
    expect(css).toContain(`.SashPanel {
  top: calc(var(--SashPanelTop) - 2px);
  width: var(--PanelWidth);
}`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss centers quick pick in the non-preview area', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'App.css'), 'utf8')

    expect(css).toContain('left: calc((100% - var(--PreviewWidth, 0px)) / 2);')
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss preserves the locations flex growth', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'parts', 'ViewletReferences.css'), 'utf8')

    expect(css).toContain(`.Locations {
  display: flex;
  flex: 1;
  flex-direction: column;
}`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss preserves the extension detail sash divider', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'parts', 'ViewletExtensionDetail.css'), 'utf8')

    expect(css).toContain(`.ExtensionDetail .Sash {
  border-left: 1px solid var(--SashBorder, gray);
  position: relative;
}`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss preserves the color theme link foreground', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'parts', 'Features.css'), 'utf8')

    expect(css).toContain(`.ColorThemeLink {
  color: var(--LinkForeground, #3794ff);
}`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss preserves the extension runtime status layout', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'parts', 'ViewletExtensionDetail.css'), 'utf8')

    expect(css).toContain(`.RuntimeStatusDefinitionList {
  align-items: baseline;
  column-gap: 24px;
  contain: content;
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  margin: 0;
  max-width: 640px;
  row-gap: 12px;
}`)
    expect(css).toContain(`.RuntimeStatusDefinitionList > dt {
  color: var(--DescriptionForeground, color-mix(in srgb, var(--WorkbenchForeground) 76%, transparent));
  font-weight: 600;
}`)
    expect(css).toContain(`.RuntimeStatusDefinitionList > dd {
  margin: 0;
  min-width: 0;
  overflow-wrap: anywhere;
}`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss preserves readable table links and invalid cell squiggles', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'parts', 'Table.css'), 'utf8')

    expect(css).toContain(`.Table .Link {
  color: var(--LinkForeground, #3794ff);
}`)
    expect(css).toContain(`.TableCellInvalid {
  text-decoration-color: var(--EditorErrorForeground, #f14c4c);
  text-decoration-line: underline;
  text-decoration-style: wavy;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss preserves the builtin extension label style', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'parts', 'ViewletExtensionDetailHeader.css'), 'utf8')

    expect(css).toContain(`.ExtensionDetailNameBadge {
  font-size: 10px;
  font-style: italic;
  margin-left: 10px;
}`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss preserves the running extensions hover styles', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'parts', 'ViewletRunningExtensions.css'), 'utf8')

    expect(css).toContain(`.RunningExtension:where(:hover) {
  background: var(--ListHoverBackground, color-mix(in srgb, var(--WorkbenchForeground) 8%, transparent));
  color: var(--ListHoverForeground, var(--WorkbenchForeground));
}`)
    expect(css).toContain(`.RunningExtension:where(:hover) .RunningExtensionId,
.RunningExtension:where(:hover) .RunningExtensionActivationTime {
  color: inherit;
}`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss preserves the running extensions row layout', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'parts', 'ViewletRunningExtensions.css'), 'utf8')

    expect(css).toContain(`.RunningExtension {
  align-items: center;
  contain: strict;
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  gap: 16px;
  height: 70px;
  padding: 0 20px;
}`)
    expect(css).toContain(`.RunningExtension:nth-child(even) {
  background: color-mix(in srgb, var(--WorkbenchForeground) 4%, transparent);
}`)
    expect(css).toContain(`.RunningExtensionDetails {
  contain: content;
  flex: none;
  min-width: 0;
  overflow: hidden;
}`)
    expect(css).toContain(`.RunningExtensionActivationDetails {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}`)
    expect(css).toContain(`.RunningExtensionActivationTime {
  contain: content;
  flex: none;
  margin-left: auto;
  text-align: right;
}`)
    expect(css).toContain(`.RunningExtensionStatus {
  flex: none;
  font-weight: 600;`)
    expect(css).toContain(`.RunningExtensionStatusError {
  color: var(--InputValidationErrorForeground, #f48771);
}`)
    expect(css).toContain(`.RunningExtensionStatusTerminated {
  color: var(--EditorWarningForeground, #cca700);
}`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss preserves the running extensions containment', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'parts', 'ViewletRunningExtensions.css'), 'utf8')

    expect(css).toContain(`.RunningExtensions {
  box-sizing: border-box;
  contain: strict;`)
    expect(css).toContain(`.RunningExtension {
  align-items: center;
  contain: strict;`)
    expect(css).toContain(`.RunningExtensionIcon {
  contain: strict;`)
    expect(css).toContain(`.RunningExtensionsEmpty {
  align-items: center;
  box-sizing: border-box;
  color: var(--WorkbenchForeground);
  contain: content;`)
    expect(css).toContain(`.RunningExtensionDetails {
  contain: content;`)
    expect(css).toContain(`.RunningExtensionTitle {
  align-items: baseline;
  contain: content;`)
    expect(css).toContain(`.RunningExtensionName,
.RunningExtensionVersion,
.RunningExtensionId,
.RunningExtensionActivationDetails,
.RunningExtensionActivationReason {
  contain: content;
}`)
    expect(css).toContain(`.RunningExtensionActivationTime {
  contain: content;`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss preserves the running extensions empty state artwork', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'parts', 'ViewletRunningExtensions.css'), 'utf8')

    expect(css).toContain(`.RunningExtensions:has(> .RunningExtensionsEmpty) {
  align-items: center;`)
    expect(css).toContain(`.RunningExtensionsEmpty::before {
  background: linear-gradient(`)
    expect(css).toContain(`mask: url(/icons/extensions.svg) 50% 50% / contain no-repeat;`)
    expect(css).toContain(`.RunningExtensionsEmpty::after {
  color: var(--DescriptionForeground, rgba(156, 162, 160, 0.9));
  content: 'Extensions will appear here once they start.';`)
    expect(css).toContain(`@media (prefers-reduced-motion: no-preference) {
  .RunningExtensionsEmpty::before {
    animation: RunningExtensionsEmptyFloat 6s ease-in-out infinite;
  }
}`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss preserves the panel background for xterm', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'parts', 'ViewletTerminal.css'), 'utf8')

    expect(css).toContain(`.XtermTerminal {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--PanelBackground);
}`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss preserves readable native select options', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '',
    })

    const css = await readFile(join(dir, 'App.css'), 'utf8')

    expect(css).toContain(`.Select > option {
  background-color: var(--DropDownBackground, #3c3c3c);
  color: var(--DropDownForeground, #f0f0f0);
}`)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)

test('bundleCss eagerly loads main area css and rewrites icon urls', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-bundle-css-'))

  try {
    await bundleCss({
      outDir: dir,
      assetDir: '/abc1234',
    })

    const css = await readFile(join(dir, 'App.css'), 'utf8')

    expect(css).toContain(`/* ViewletMainDragOverlay.css */`)
    expect(css).toContain(`/* ViewletMainEditorGroup.css */`)
    expect(css).toContain(`/* ViewletMainWaterMark.css */`)
    expect(css).toContain(`mask-image: url(/abc1234/icons/icon.svg);`)
    expect(css).not.toContain(`url(/icons/`)
    await expect(readFile(join(dir, 'parts', 'ViewletMainDragOverlay.css'), 'utf8')).rejects.toThrow()
    await expect(readFile(join(dir, 'parts', 'ViewletMainEditorGroup.css'), 'utf8')).rejects.toThrow()
    await expect(readFile(join(dir, 'parts', 'ViewletMainWaterMark.css'), 'utf8')).rejects.toThrow()
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}, 30_000)
