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
  - [PeerA](./peer-a.json)
  - [PeerB](./peer-b.json)
**Dramatization:**
  - PeerA starts listening on port 10000 with a TCP transport
  - PeerB starts listening on port 10001 with a TCP transport
  - PeerB starts handling a '/echo/1.0.0' protocol that echoes back anything it receives
  - PeerA starts handling a '/time/1.0.0' protocol that sends the current time (Unix time) and closes the conn afterwars.
  - PeerA dials to PeerB on '/ping/1.0.0', it is successful.
  - PeerB dials to PeerA on '/ping/1.0.0', it is successful.
  - PeerA dials to PeerB on '/echo/1.0.0' and sends a Buffer with a String "Hey", it is successful.
  - PeerB dials to PeerA on '/time/1.0.0' and receives the time from PeerA, confirms that it is a time from the past (thinks to himself that this time time is hard).
  - Both peers shutdown and the test ends.

## Story 2 - Two nodes discover each other through MulticastDNS

**Cast:**
  - [PeerA](./peer-a.json)
  - [PeerB](./peer-b.json)
**Dramatization:**
  - PeerA starts listening on port 10000 with a TCP transport.
  - PeerB starts listening on port 10001 with a TCP transport.
  - Both nodes discover each other through MulticastDNS after the default 10 second interval has passed.
  - Both peers shutdown and the test ends.


## Story 3 - Three nodes create a Publish Subscribe chain (a -> b -> c)

**Cast:**
  - [PeerA](./peer-a.json)
  - [PeerB](./peer-b.json)
  - [PeerC](./peer-c.json)
**Dramatization:**
  - PeerA starts listening on port 10000 with a TCP transport.
  - PeerB starts listening on port 10001 with a TCP transport.
  - PeerC starts listening on port 10002 with a TCP transport.
  - PeerA dials to PeerB
  - PeerB dials to PeerC
  - PeerC subscribes to the topic 'interplanetary recipes'
  - PeerB subscribes to the topic 'interplanetary recipes'
  - PeerA publish on the topic 'interplanetary recipes' a 'secret space meatballs sauce' message.
  - PeerB receives the message.
  - PeerC receives the message.
  - The three peers shutdown and the test ends.

## Story 4 - Five nodes are connected in a ring, every node can find their addresses through Peer Routing

**Cast:**
  - [PeerA](./peer-a.json)
  - [PeerB](./peer-b.json)
  - [PeerC](./peer-c.json)
  - [PeerD](./peer-d.json)
  - [PeerE](./peer-e.json)
**Dramatization:**
  - PeerA starts listening on port 10000 with a TCP transport.
  - PeerB starts listening on port 10001 with a TCP transport.
  - PeerC starts listening on port 10002 with a TCP transport.
  - PeerD starts listening on port 10003 with a TCP transport.
  - PeerE starts listening on port 10004 with a TCP transport.
  - PeerA dials to PeerB.
  - PeerB dials to PeerC.
  - PeerC dials to PeerD.
  - PeerD dials to PeerE.
  - PeerE dials to PeerA.
  - PeerA does a PeerRouting .findPeer call to find PeerC, it is successful.
  - PeerB does a PeerRouting .findPeer call to find PeerD, it is successful.
  - PeerC does a PeerRouting .findPeer call to find PeerE, it is successful.
  - PeerD does a PeerRouting .findPeer call to find PeerA, it is successful.
  - PeerE does a PeerRouting .findPeer call to find PeerB, it is successful.
  - The five peers shutdown and the test ends.

## Story 5 - Five nodes are connected in a ring, PeerA provides a block, PeerC finds who is providing through Content Routing

**Cast:**
  - [PeerA](./peer-a.json)
  - [PeerB](./peer-b.json)
  - [PeerC](./peer-c.json)
  - [PeerD](./peer-d.json)
  - [PeerE](./peer-e.json)
**Dramatization:**
  - PeerA starts listening on port 10000 with a TCP transport.
  - PeerB starts listening on port 10001 with a TCP transport.
  - PeerC starts listening on port 10002 with a TCP transport.
  - PeerD starts listening on port 10003 with a TCP transport.
  - PeerE starts listening on port 10004 with a TCP transport.
  - PeerA dials to PeerB.
  - PeerB dials to PeerC.
  - PeerC dials to PeerD.
  - PeerD dials to PeerE.
  - PeerE dials to PeerA.
  - PeerA does a ContentRouting .provide call to provide a the following CID 'QmVCsaHeMYJecUWpiuYj6UP4PRZz6PoQnAVL89EX6xvaJR'
  - PeerC does a ContentRouting .findProviders call to find PeerA multiaddrs as the provider for the same CID.
  - The five peers shutdown and the test ends.
