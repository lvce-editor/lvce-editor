import { setup } from '../fixtures/editor-cursor-split.js'

export const name = 'viewlet.main-editor-cursor-after-split-up'

export const test = async (api) => setup(api, 'Up')
