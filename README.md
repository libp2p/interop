# @libp2p/interop <!-- omit in toc -->

[![libp2p.io](https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square)](http://libp2p.io/)
[![IRC](https://img.shields.io/badge/freenode-%23libp2p-yellow.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23libp2p)
[![Discuss](https://img.shields.io/discourse/https/discuss.libp2p.io/posts.svg?style=flat-square)](https://discuss.libp2p.io)
[![codecov](https://img.shields.io/codecov/c/github/libp2p/interop.svg?style=flat-square)](https://codecov.io/gh/libp2p/interop)
[![CI](https://img.shields.io/github/workflow/status/libp2p/js-libp2p-interfaces/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/libp2p/interop/actions/workflows/js-test-and-release.yml)

> Interoperability Tests for libp2p

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
  - [Running the tests](#running-the-tests)
- [Contribute](#contribute)
- [License](#license)
- [Contribute](#contribute-1)

## Install

```console
$ npm i @libp2p/interop
```

This repository will be used for interop tests.

## Usage

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

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribute

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
