import { join } from 'node:path'
import * as Root from '../Root/Root.js'

export const getStaticPath = () => {
  return join(Root.root, 'static')
}
