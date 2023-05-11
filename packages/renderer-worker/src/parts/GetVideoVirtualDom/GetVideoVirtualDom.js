import { div, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getVideoVirtualDom = (src, errorMessage) => {
  if (errorMessage) {
    return [
      div(
        {
          className: 'VideoContent',
        },
        1
      ),
      div(
        {
          className: 'VideoErrorMessage',
        },
        1
      ),
      text(errorMessage),
    ]
  }
  const dom = [
    div(
      {
        className: 'VideoContent',
      },
      1
    ),
    div(
      {
        className: 'VideoVideo',
        src,
        controls: true,
      },
      0
    ),
  ]
  return dom
}
