import { describe, expect, test } from '@jest/globals'
import { join } from 'node:path'
import * as ElectronBuilderConfigType from '../src/parts/ElectronBuilderConfigType/ElectronBuilderConfigType.js'
import { resolveBuiltArtifactPath } from '../src/parts/ResolveBuiltArtifactPath/ResolveBuiltArtifactPath.js'

describe('resolveBuiltArtifactPath', () => {
  test('returns expected path when the expected artifact exists', () => {
    const distPath = join('packages', 'build', '.tmp', 'electron-builder', 'dist')
    const expectedPath = join(distPath, 'lvce-oss-0.0.0.AppImage')
    const result = resolveBuiltArtifactPath({
      config: ElectronBuilderConfigType.AppImage,
      version: '0.0.0',
      expectedPath,
      distEntries: ['lvce-oss-0.0.0.AppImage'],
      distPath,
    })

    expect(result).toBe(expectedPath)
  })

  test('falls back to the built app image artifact when electron-builder uses productName', () => {
    const distPath = join('packages', 'build', '.tmp', 'electron-builder', 'dist')
    const expectedPath = join(distPath, 'lvce-oss-0.0.0.AppImage')
    const result = resolveBuiltArtifactPath({
      config: ElectronBuilderConfigType.AppImage,
      version: '0.0.0',
      expectedPath,
      distEntries: ['Lvce Editor - OSS-0.0.0.AppImage'],
      distPath,
    })

    expect(result).toBe(join(distPath, 'Lvce Editor - OSS-0.0.0.AppImage'))
  })
})
