# The IPFS Bundle - Compliance Test Stories

> These test stories check for compliance using the libp2p bundle used for IPFS. A libp2p implementation that is successful at implementing these stories.

The basic IPFS bundle is composed by:

```
class Node extends libp2p {
  constructor () {
    const modules = {
      transport: [
        new TCP(),
        new WebSockets()
      ],
      connection: {
        muxer: [
          Multiplex,
          Yamux
        ],
        crypto: [
          SECIO
          // TLS 1.3 (Soon™)
        ]
      },
      discovery: [
        wsstar.discovery,
        new MulticastDNS(peerInfo, 'ipfs.local'),
        new Railing()
      ],
      DHT: KadDHT,
      // Currently, PeerRouting and ContentRouting are attached
      // from the KadDHT package. In the future we will have both systems in its own separate modules.
      // PeerRouting: [],
      // ContentRouting: []
    }

    super(modules)
  }
}
```

## Story 1 - Two Peers dial each other on multiple protocols, including Ping.

**Cast:**
  - 
**Dramatization:**
  - 

## Story 2 - Two nodes discover each other through MulticastDNS

**Cast:**
  - 
**Dramatization:**
  - 

## Story 3 - Three nodes create a Publish Subscribe chain (a -> b -> c)

**Cast:**
  - 
**Dramatization:**
  - 

## Story 4 - Five nodes are connected in a ring, every node can find their addresses through Peer Routing

**Cast:**
  - 
**Dramatization:**
  - 

## Story 5 - Five nodes are connected in a ring, PeerA provides a block, PeerC finds who is providing through Content Routing

**Cast:**
  - 
**Dramatization:**
  - 
