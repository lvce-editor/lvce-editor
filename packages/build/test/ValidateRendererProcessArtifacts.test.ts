import { mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@jest/globals'
import { validateRendererProcessArtifacts } from '../src/parts/ValidateRendererProcessArtifacts/ValidateRendererProcessArtifacts.ts'

test('validates renderer process main and xterm artifacts', async () => {
  const rendererProcessPath = join(tmpdir(), `lvce-renderer-process-${process.pid}`)
  const distPath = join(rendererProcessPath, 'dist')
  try {
    await mkdir(distPath, { recursive: true })
    await writeFile(join(distPath, 'rendererProcessMain.js'), '')
    await writeFile(join(distPath, 'xterm.js'), '')

    expect(() => validateRendererProcessArtifacts({ rendererProcessPath })).not.toThrow()
  } finally {
    await rm(rendererProcessPath, { recursive: true, force: true })
  }
})

test('throws when the xterm artifact is missing', async () => {
  const rendererProcessPath = join(tmpdir(), `lvce-renderer-process-missing-${process.pid}`)
  const distPath = join(rendererProcessPath, 'dist')
  try {
    await mkdir(distPath, { recursive: true })
    await writeFile(join(distPath, 'rendererProcessMain.js'), '')

    expect(() => validateRendererProcessArtifacts({ rendererProcessPath })).toThrow('renderer process artifact not found')
  } finally {
    await rm(rendererProcessPath, { recursive: true, force: true })
  }
})
