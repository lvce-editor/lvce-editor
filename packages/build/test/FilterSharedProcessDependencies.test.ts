import { expect, test } from '@jest/globals'
import * as FilterSharedProcessDependencies from '../src/parts/FilterSharedProcessDependencies/FilterSharedProcessDependencies.ts'

test('includes runtime dependencies of ripgrep', () => {
  const dependencies = {
    name: '@lvce-editor/shared-process',
    path: '/project/packages/shared-process',
    dependencies: {
      '@lvce-editor/ripgrep': {
        name: '@lvce-editor/ripgrep',
        path: '/project/node_modules/@lvce-editor/ripgrep',
        dependencies: {
          '@vscode/ripgrep': {
            name: '@vscode/ripgrep',
            path: '/project/node_modules/@vscode/ripgrep',
            dependencies: {
              '@vscode/ripgrep-darwin-arm64': {
                name: '@vscode/ripgrep-darwin-arm64',
                path: '/project/node_modules/@vscode/ripgrep-darwin-arm64',
              },
            },
          },
        },
      },
    },
  }

  expect(FilterSharedProcessDependencies.filterDependencies(dependencies)).toEqual([
    '/project/node_modules/@lvce-editor/ripgrep',
    '/project/node_modules/@vscode/ripgrep',
    '/project/node_modules/@vscode/ripgrep-darwin-arm64',
  ])
})
