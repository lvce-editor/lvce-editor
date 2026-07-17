import { expect, jest, test } from '@jest/globals'
import { promptSave } from '../src/parts/ConfirmPromptElectron/ConfirmPromptElectron.js'

const options = {
  cancelMessage: 'Cancel',
  discardMessage: "Don't Save",
  saveMessage: 'Save',
  title: 'Save Changes',
}

test.each([
  [0, 'cancel'],
  [1, 'discard'],
  [2, 'save'],
])('promptSave maps dialog result %s to %s', async (dialogResult, expected) => {
  const showMessageBox = jest.fn<(options: unknown) => Promise<number>>(async () => dialogResult)

  const result = await promptSave('Save changes to test.txt?', options, showMessageBox)

  expect(result).toBe(expected)
  expect(showMessageBox).toHaveBeenCalledWith({
    buttons: ['Cancel', "Don't Save", 'Save'],
    cancelId: 0,
    defaultId: 2,
    message: 'Save changes to test.txt?',
    title: 'Save Changes',
    type: 'question',
  })
})
