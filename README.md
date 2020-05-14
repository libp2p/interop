# Interoperability Tests for libp2p

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](https://protocol.ai/)
[![](https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square)](http://libp2p.io/)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23libp2p)
[![Discourse posts](https://img.shields.io/discourse/https/discuss.libp2p.io/posts.svg)](https://discuss.libp2p.io)

> Interoperability tests for libp2p Implementations

This repository will be used for interop tests.

## Lead Maintainer

[Vasco Santos](https://github.com/vasco-santos)

## Usage

### Install

```
> git clone git@github.com:libp2p/interop.git
> cd interop
> npm install
```

### Run the tests

```
> npm test
```

#### Testing local daemons

It is possible to test local versions of the go and js daemons exporting the respective path before running the tests.

**Specifying the go-libp2p daemon**
See the go-libp2p-daemon [install instructions](https://github.com/libp2p/go-libp2p-daemon#install) for building the local binary.

```sh
$ LIBP2P_GO_BIN=$GOPATH/bin/p2pd npm run test
```

**Specifying the js-libp2p daemon**
From the js-libp2p-daemon local repo checkout you can perform an `npm link` to create a binary, `jsp2pd` in the global npm space.

```sh
$ LIBP2P_JS_BIN=$(which jsp2pd) npm run test
```

## Contribute

Feel free to join in. All welcome. Open an [issue](https://github.com/ipfs/ipfs-interop/issues)!

This repository falls under the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/contributing.md)

## License

MIT
