# Interoperability Tests for libp2p

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](https://protocol.ai/)
[![](https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square)](http://libp2p.io/)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23libp2p)
[![Discourse posts](https://img.shields.io/discourse/https/discuss.libp2p.io/posts.svg)](https://discuss.libp2p.io)

> Interoperability tests for libp2p Implementations

This repository will be used for interop tests.

## Usage

### Install

```
> npm install @libp2p/interop
```

### Running the tests

Create a js file that configures the different types of daemon:

```js
import { interopTests } from '@libp2p/interop'
import type { Daemon, DaemonFactory } from '@libp2p/interop'

async function createGoPeer (options: SpawnOptions): Promise<Daemon> {
  // your implementation here
}

async function createJsPeer (options: SpawnOptions): Promise<Daemon> {
  // your implementation here
}

async function main () {
  const factory: DaemonFactory = {
    async spawn (options: SpawnOptions) {
      if (options.type === 'go') {
        return createGoPeer(options)
      }

      return createJsPeer(options)
    }
  }

  interopTests(factory)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
```

For an example, see the js-libp2p interop test runner.

## Contribute

Feel free to join in. All welcome. Open an [issue](https://github.com/ipfs/ipfs-interop/issues)!

This repository falls under the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/contributing.md)

## License

Licensed under either of

 * Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / http://www.apache.org/licenses/LICENSE-2.0)
 * MIT ([LICENSE-MIT](LICENSE-MIT) / http://opensource.org/licenses/MIT)
