import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const button = (label, name, listener, icon, pressed) => [
  {
    type: VirtualDomElements.Button,
    className: 'IconButton',
    name: `simple-browser-find-${name}`,
    ariaLabel: label,
    title: label,
    onClick: listener,
    ...(pressed === undefined ? {} : { ariaPressed: pressed }),
    childCount: 1,
  },
  { type: VirtualDomElements.Div, className: `MaskIcon MaskIcon${icon}`, childCount: 0 },
]

export const getBrowserFindVirtualDom = (state) => [
  { type: VirtualDomElements.Div, className: 'SimpleBrowserFind', role: 'search', ariaLabel: 'Find in page', childCount: 6 },
  {
    type: VirtualDomElements.Input,
    className: 'InputBox',
    name: 'simple-browser-find',
    inputType: 'text',
    ariaLabel: 'Find in page',
    placeholder: 'Find in page',
    value: state.findValue,
    onInput: 'handleSimpleBrowserFindInput',
    childCount: 0,
  },
  { type: VirtualDomElements.Span, className: 'SimpleBrowserFindCount', role: 'status', ariaLive: 'polite', childCount: 1 },
  text(state.findValue ? (state.findMatches ? `${state.findActiveMatch} of ${state.findMatches}` : 'No results') : ''),
  ...button('Match Case', 'case', 'handleSimpleBrowserFindCase', 'CaseSensitive', state.findMatchCase),
  ...button('Previous Match (Shift+Enter)', 'previous', 'handleSimpleBrowserFindPrevious', 'ArrowUp'),
  ...button('Next Match (Enter)', 'next', 'handleSimpleBrowserFindNext', 'ArrowDown'),
  ...button('Close Find (Escape)', 'close', 'handleSimpleBrowserFindClose', 'Close'),
]
