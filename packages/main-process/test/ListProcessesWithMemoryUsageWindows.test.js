const ListProcessesWithMemoryUsage = require('../src/parts/ListProcessesWithMemoryUsage/ListProcessesWithMemoryUsageWindows.js')
const WindowsProcessTree = require('windows-process-tree')
const { VError } = require('verror')

jest.mock(
  'windows-process-tree',
  () => ({
    getProcessList: jest.fn(),
    getProcessCpuUsage: jest.fn(),
    ProcessDataFlag: {
      CommandLine: 1,
      Memory: 2,
    },
  }),
  {
    virtual: true,
  }
)

test('listProcessesWithMemoryUsage - error - rootPid not found', async () => {
  // @ts-ignore
  WindowsProcessTree.getProcessList.mockImplementation((rootPid, callback) => {
    callback([
      {
        name: 'electron.exe',
        pid: 9176,
        ppid: 9256,
        memory: 95653888,
        commandLine:
          'C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe .',
        cpu: 0.19305019305019305,
      },
      {
        name: 'electron.exe',
        pid: 7004,
        ppid: 9176,
        memory: 94089216,
        commandLine:
          '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=gpu-process --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --gpu-preferences=UAAAAAAAAADgAAAYAAAAAAAAAAAAAAAAAABgAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgAAAAAAAAASAAAAAAAAAAYAAAAAgAAABAAAAAAAAAAGAAAAAAAAAAQAAAAAAAAAAAAAAAOAAAAEAAAAAAAAAABAAAADgAAAAgAAAAAAAAACAAAAAAAAAA= --mojo-platform-channel-handle=1628 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:2',
        cpu: 0.19305019305019305,
      },
      {
        name: 'electron.exe',
        pid: 5892,
        ppid: 9176,
        memory: 43425792,
        commandLine:
          '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=utility --utility-sub-type=network.mojom.NetworkService --lang=en-US --service-sandbox-type=none --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --mojo-platform-channel-handle=1832 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:8',
        cpu: 0,
      },
      {
        name: 'electron.exe',
        pid: 11608,
        ppid: 9176,
        memory: 83259392,
        commandLine:
          '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=renderer --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path="C:\\Users\\test-user\\Documents\\app\\packages\\main-process" --enable-sandbox --lang=en-US --device-scale-factor=1 --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=4 --launch-time-ticks=3327042247 --mojo-platform-channel-handle=2184 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:1',
        cpu: 0,
      },
      {
        name: 'electron.exe',
        pid: 9612,
        ppid: 9176,
        memory: 75100160,
        commandLine:
          'C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe --experimental-json-modules --max-old-space-size=60 --enable-source-maps C:\\Users\\test-user\\Documents\\app\\packages\\extension-host\\src\\extensionHostMain.js',
        cpu: 0,
      },
      {
        name: 'electron.exe',
        pid: 2000,
        ppid: 9176,
        memory: 73048064,
        commandLine:
          '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=renderer --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path="C:\\Users\\test-user\\Documents\\app\\packages\\main-process" --enable-sandbox --lang=en-US --device-scale-factor=1 --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=5 --launch-time-ticks=3330732877 --mojo-platform-channel-handle=3216 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:1',
        cpu: 0.3861003861003861,
      },
    ])
  })
  // @ts-ignore
  WindowsProcessTree.getProcessCpuUsage.mockImplementation((list, callback) => {
    callback([
      {
        name: 'electron.exe',
        pid: 9176,
        ppid: 9256,
        memory: 95653888,
        commandLine:
          'C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe .',
        cpu: 0.19305019305019305,
      },
      {
        name: 'electron.exe',
        pid: 7004,
        ppid: 9176,
        memory: 94089216,
        commandLine:
          '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=gpu-process --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --gpu-preferences=UAAAAAAAAADgAAAYAAAAAAAAAAAAAAAAAABgAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgAAAAAAAAASAAAAAAAAAAYAAAAAgAAABAAAAAAAAAAGAAAAAAAAAAQAAAAAAAAAAAAAAAOAAAAEAAAAAAAAAABAAAADgAAAAgAAAAAAAAACAAAAAAAAAA= --mojo-platform-channel-handle=1628 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:2',
        cpu: 0.19305019305019305,
      },
      {
        name: 'electron.exe',
        pid: 5892,
        ppid: 9176,
        memory: 43425792,
        commandLine:
          '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=utility --utility-sub-type=network.mojom.NetworkService --lang=en-US --service-sandbox-type=none --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --mojo-platform-channel-handle=1832 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:8',
        cpu: 0,
      },
      {
        name: 'electron.exe',
        pid: 11608,
        ppid: 9176,
        memory: 83259392,
        commandLine:
          '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=renderer --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path="C:\\Users\\test-user\\Documents\\app\\packages\\main-process" --enable-sandbox --lang=en-US --device-scale-factor=1 --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=4 --launch-time-ticks=3327042247 --mojo-platform-channel-handle=2184 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:1',
        cpu: 0,
      },
      {
        name: 'electron.exe',
        pid: 9612,
        ppid: 9176,
        memory: 75100160,
        commandLine:
          'C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe --experimental-json-modules --max-old-space-size=60 --enable-source-maps C:\\Users\\test-user\\Documents\\app\\packages\\extension-host\\src\\extensionHostMain.js',
        cpu: 0,
      },
      {
        name: 'electron.exe',
        pid: 2000,
        ppid: 9176,
        memory: 73048064,
        commandLine:
          '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=renderer --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path="C:\\Users\\test-user\\Documents\\app\\packages\\main-process" --enable-sandbox --lang=en-US --device-scale-factor=1 --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=5 --launch-time-ticks=3330732877 --mojo-platform-channel-handle=3216 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:1',
        cpu: 0.3861003861003861,
      },
    ])
  })
  expect(
    await ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(25666)
  ).toEqual([
    {
      cmd: 'C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe .',
      memory: 95653888,
      name: '<unknown> C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe .',
      pid: 9176,
      ppid: 9256,
    },
    {
      cmd: '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=gpu-process --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --gpu-preferences=UAAAAAAAAADgAAAYAAAAAAAAAAAAAAAAAABgAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgAAAAAAAAASAAAAAAAAAAYAAAAAgAAABAAAAAAAAAAGAAAAAAAAAAQAAAAAAAAAAAAAAAOAAAAEAAAAAAAAAABAAAADgAAAAgAAAAAAAAACAAAAAAAAAA= --mojo-platform-channel-handle=1628 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:2',
      memory: 94089216,
      name: 'gpu-process',
      pid: 7004,
      ppid: 9176,
    },
    {
      cmd: '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=utility --utility-sub-type=network.mojom.NetworkService --lang=en-US --service-sandbox-type=none --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --mojo-platform-channel-handle=1832 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:8',
      memory: 43425792,
      name: 'utility',
      pid: 5892,
      ppid: 9176,
    },
    {
      cmd: '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=renderer --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path="C:\\Users\\test-user\\Documents\\app\\packages\\main-process" --enable-sandbox --lang=en-US --device-scale-factor=1 --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=4 --launch-time-ticks=3327042247 --mojo-platform-channel-handle=2184 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:1',
      memory: 83259392,
      name: 'renderer',
      pid: 11608,
      ppid: 9176,
    },
    {
      cmd: 'C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe --experimental-json-modules --max-old-space-size=60 --enable-source-maps C:\\Users\\test-user\\Documents\\app\\packages\\extension-host\\src\\extensionHostMain.js',
      memory: 75100160,
      name: 'extension-host',
      pid: 9612,
      ppid: 9176,
    },
    {
      cmd: '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=renderer --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path="C:\\Users\\test-user\\Documents\\app\\packages\\main-process" --enable-sandbox --lang=en-US --device-scale-factor=1 --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=5 --launch-time-ticks=3330732877 --mojo-platform-channel-handle=3216 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:1',
      memory: 73048064,
      name: 'renderer',
      pid: 2000,
      ppid: 9176,
    },
  ])
})

test('listProcessesWithMemoryUsage - error - rootPid not found', async () => {
  // @ts-ignore
  WindowsProcessTree.getProcessList.mockImplementation((rootPid, callback) => {
    callback(undefined)
  })
  await expect(
    ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(25666)
  ).rejects.toThrowError(new VError('Root process 25666 not found'))
})
