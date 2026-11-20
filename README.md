<a name="banner"><img src="https://cdn.jsdelivr.net/gh/tsdotnet/disposable@master/assets/banner.svg" alt="@tsdotnet/disposable: Dispose once, safely. For anything that holds resources."></a>

[![npm version](https://img.shields.io/npm/v/@tsdotnet/disposable.svg?style=flat-square)](https://www.npmjs.com/package/@tsdotnet/disposable)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/tsdotnet/disposable/blob/master/LICENSE)

Base classes for objects that own resources: cleanup runs once, and use after disposal throws.

## Install

```sh
npm install @tsdotnet/disposable
```

## Usage

```ts
import { DisposableBase } from '@tsdotnet/disposable';

class Connection extends DisposableBase {
  constructor (private readonly socket: WebSocket) { super(); }

  send (data: string): void {
    this.assertIsAlive(); // throws once disposed
    this.socket.send(data);
  }

  protected override _onDispose (): void {
    this.socket.close(); // runs once, however often dispose() is called
  }
}
```

Async cleanup: extend `AsyncDisposableBase`. Several at once: `dispose(a, b, c)`.

## Use it from

ESM (`import { DisposableBase } from '@tsdotnet/disposable';`) or CommonJS (`const { DisposableBase } = require('@tsdotnet/disposable');`).

<details><summary>In a browser, without a bundler</summary>

```html
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/disposable@2/dist/umd/disposable.min.js"></script>
<script>
  const { DisposableBase } = tsdotnet.disposable;
</script>
```

</details>

## Docs

[tsdotnet.github.io/disposable](https://tsdotnet.github.io/disposable/)
