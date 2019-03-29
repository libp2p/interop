# DHT

In this set of tests, we intend to guarantee that nodes implemented in a specific language are able to use the dht features correctly, regardless of their implementation language.

This test suite is divided in three main focus:

- `content-fetching` aims to test the DHT interop regarding `put` and `get` operations between peers
- `content-routing` aims to test the DHT interop regarding `provide` and `findProviders` operations between peers
- `peer-routing` aims to test the DHT interop regarding `findPeer` operations between peers
