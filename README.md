# Interoperability Compliance Test Stories for libp2p

<a href="http://protocol.ai"><img src="https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square" /></a>
<a href="http://libp2p.io/"><img src="https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square" /></a>
<a href="http://webchat.freenode.net/?channels=%23libp2p"><img src="https://img.shields.io/badge/freenode-%23libp2p-yellow.svg?style=flat-square" /></a>
<a href="https://waffle.io/libp2p/libp2p"><img src="https://img.shields.io/badge/pm-waffle-yellow.svg?style=flat-square" /></a>

> In this repo you will find the [PDD (Protocol Driven Development)](https://github.com/ipfs/pdd) stories that enable you to test a libp2p implementation against other implementations.

## ❗️ Important

**The setup for these tests is still in flux, please make sure to read the latest update at: https://github.com/libp2p/interop/issues/1**

## PDD Compliance Test Stories

Each Test Story has actors and a dramatization.

- **Qualitative** - Test Stories that check feature interoperability and compliance.
  - [Transports](./PDD-TRANSPORTS.md)
  - [Protocol and Stream Multiplexing](./PDD-PROTOCOL-AND-STREAM-MULTIPLEXING.md)
  - [Identify](./PDD-IDENTIFY.md)
  - [Encrypted Communications](./PDD-ENCRYPTED-COMMUNICATIONS.md)
  - [Peer Routing](./PDD-PEER-ROUTING.md)
  - [Content Routing](./PDD-CONTENT-ROUTING.md)
  - [PubSub](./PDD-PUBSUB.md)
  - [Circuit Relay](./PDD-CIRCUIT-RELAY.md)
  - [The IPFS bundle](./PDD-THE-IPFS-BUNDLE.md)
- **Quantitative** - Test Stories focused on stress testing the implementations against each other.
  - [Thousands of Muxed Streams](./PDD-THOUSANDS-OF-MUXED-STREAMS.md)
  - [Hundreds of Peer Connections](./PDD-HUNDREDS-OF-PEER-CONNECTIONS.md)

## Contribute

Feel free to join in. All welcome. Open an [issue](https://github.com/ipfs/ipfs-interop/issues)!

This repository falls under the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/contributing.md)

## License

MIT
