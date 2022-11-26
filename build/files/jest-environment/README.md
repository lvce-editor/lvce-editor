# jest-environment-lvce-editor

Run your tests using Jest & lvce editor api

## Usage

```js
/**
 * @jest-environment lvce-editor
 */
const testCommand = {
  id: 'test-command',
  execute: 42,
}

test('registerCompletionProvider', async () => {
  vscode.registerCommand(testCommand)
  expect(await vscode.executeCommand('test-command')).toBe(42)
})
```
