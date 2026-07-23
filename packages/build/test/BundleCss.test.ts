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
    expect(css).toContain(`.RunningExtensionActivationTime {
  flex: none;
  margin-left: auto;
  text-align: right;
}`)
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
