import { expect, test } from '@jest/globals'
import * as WalkDependencies from '../src/parts/WalkDependencies/WalkDependencies.ts'

test('walks hoisted optional dependencies', () => {
  const visited: string[] = []
  const dependencyTree = {
    name: '@lvce-editor/pty-host',
    path: '/project/node_modules/@lvce-editor/pty-host',
    dependencies: {
      '@lvce-editor/command': {
        name: '@lvce-editor/command',
        path: '/project/node_modules/@lvce-editor/command',
      },
    },
    _dependencies: {
      '@lvce-editor/command': '^2.0.0',
      'node-pty': '1.1.0-beta34',
    },
  }

  WalkDependencies.walkDependencies(dependencyTree, (dependency) => {
    visited.push(dependency.name)
    return true
  })

  expect(visited).toEqual(['@lvce-editor/pty-host', '@lvce-editor/command', 'node-pty'])
})
