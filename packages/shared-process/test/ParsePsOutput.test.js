import * as ParsePsOutput from '../src/parts/ParsePsOutput/ParsePsOutput.js'

test('parsePsOutput - linux', () => {
  const output = `1       0  0.0  0.1 /sbin/init splash
  2127    1442  0.0  0.2 /usr/libexec/gsd-keyboard
  2130    1442  0.0  0.2 /usr/libexec/gsd-media-keys
  2133    1442  0.0  0.2 /usr/libexec/gsd-power
  2134    1442  0.0  0.1 /usr/libexec/gsd-print-notifications
  2135    1442  0.0  0.0 /usr/libexec/gsd-rfkill
  2136    1442  0.0  0.0 /usr/libexec/gsd-screensaver-proxy
  2138    1442  0.0  0.0 /usr/libexec/gsd-sharing`
  const rootPid = 1442
  const pidMap = {}
  expect(ParsePsOutput.parsePsOutput(output, rootPid, pidMap)).toEqual([
    {
      cmd: '/usr/libexec/gsd-keyboard',
      depth: 1,
      name: '/usr/libexec/gsd-keyboard',
      pid: 2127,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-media-keys',
      depth: 1,
      name: '/usr/libexec/gsd-media-keys',
      pid: 2130,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-power',
      depth: 1,
      name: '/usr/libexec/gsd-power',
      pid: 2133,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-print-notifications',
      depth: 1,
      name: '/usr/libexec/gsd-print-notifications',
      pid: 2134,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-rfkill',
      depth: 1,
      name: '/usr/libexec/gsd-rfkill',
      pid: 2135,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-screensaver-proxy',
      depth: 1,
      name: '/usr/libexec/gsd-screensaver-proxy',
      pid: 2136,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-sharing',
      depth: 1,
      name: '/usr/libexec/gsd-sharing',
      pid: 2138,
      ppid: 1442,
    },
  ])
})

test('parsePsOutput - macos', () => {
  const output = `1       0  0.0  0.1 /sbin/init splash
  2127    1442  0.0  0.2 /usr/libexec/gsd-keyboard
  2130    1442  0.0  0.2 /usr/libexec/gsd-media-keys
  2133    1442  0.0  0.2 /usr/libexec/gsd-power
  2134    1442  0.0  0.1 /usr/libexec/gsd-print-notifications
  2135    1442  0.0  0.0 /usr/libexec/gsd-rfkill
  2136    1442  0.0  0.0 /usr/libexec/gsd-screensaver-proxy
  2138    1442  0.0  0.0 /usr/libexec/gsd-sharing`
  const rootPid = 1442
  const pidMap = {}
  expect(ParsePsOutput.parsePsOutput(output, rootPid, pidMap)).toEqual([
    {
      cmd: '/usr/libexec/gsd-keyboard',
      depth: 1,
      name: '/usr/libexec/gsd-keyboard',
      pid: 2127,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-media-keys',
      depth: 1,
      name: '/usr/libexec/gsd-media-keys',
      pid: 2130,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-power',
      depth: 1,
      name: '/usr/libexec/gsd-power',
      pid: 2133,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-print-notifications',
      depth: 1,
      name: '/usr/libexec/gsd-print-notifications',
      pid: 2134,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-rfkill',
      depth: 1,
      name: '/usr/libexec/gsd-rfkill',
      pid: 2135,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-screensaver-proxy',
      depth: 1,
      name: '/usr/libexec/gsd-screensaver-proxy',
      pid: 2136,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-sharing',
      depth: 1,
      name: '/usr/libexec/gsd-sharing',
      pid: 2138,
      ppid: 1442,
    },
  ])
})
