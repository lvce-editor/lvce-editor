# LVCE Editor

VS Code inspired text editor that mostly runs in a webworker.

## Contributing

```sh
git clone git@github.com:lvce-editor/lvce-editor.git &&
cd lvce-editor &&
npm ci &&
npm test
```

<img alt="Static Badge" src="https://img.shields.io/badge/OSS%20hosting%20by-cloudsmith-blue?logo=cloudsmith&style=flat-square&link=https%3A%2F%2Fcloudsmith.com">

Package repository hosting is graciously provided by [Cloudsmith](https://cloudsmith.com).
Cloudsmith is the only fully hosted, cloud-native, universal package management solution, that
enables your organization to create, store and share packages in any format, to any place, with total
confidence.

### Developing with the native TypeScript server

For `typescript.useTs7`, prepare the development checkout with `node packages/build/scripts/prepare-typescript-language-server.ts`. Packaged desktop applications include the pinned server for their target OS and architecture; the server package includes the build host's server. The TypeScript extension archive contains no native executable.
