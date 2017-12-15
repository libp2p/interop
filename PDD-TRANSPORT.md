resuNSPORT.md


## Story 1 - Two nodes start, one dials the other using TCP

**Cast:**
  - [PeerA](./peer-a.json)
  - [PeerB](./peer-b.json)
**Dramatization:**
  - PeerA and PeerB start a libp2p Node with only the TCP transport enabled on port 10000 and 10001 respectively
  - PeerB starts handling a '/echo/1.0.0' protocol that echoes back anything it receives
  - PeerA dials to PeerB on '/echo/1.0.0'
  - PeerA recognizes it has a dial to PeerB. PeerB can't recognize PeerA neither CryptoAuth or Identify are Enabled
  - PeerA sends 1Mb of random information and checks it gets echoed back
  - PeerA ends the connection graciously
  - PeerB receives the connection and ends the connection too
  - Both peers shutdown and the test ends

## Story 2 - Two nodes start, one dials the other using WebSockets

**Cast:**
  - [PeerA](./peer-a.json)
  - [PeerB](./peer-b.json)
**Dramatization:**
  - PeerA and PeerB start a libp2p Node with only the WebSockets transport enabled on port 10000 and 10001 respectively
  - PeerB starts handling a '/echo/1.0.0' protocol that echoes back anything it receives
  - PeerA dials to PeerB on '/echo/1.0.0'
  - PeerA recognizes it has a dial to PeerB. PeerB can't recognize PeerA neither CryptoAuth or Identify are Enabled
  - PeerA sends 1Mb of random information and checks it gets echoed back

  - PeerA ends the connection graciously
  - PeerB receives the connection and ends the connection too
  - Both peers shutdown and the test ends

## Story 3 - Two nodes start, one dials the other but fails due to lack of a mutual supported transport.

**Cast:**
  - [PeerA](./peer-a.json)
  - [PeerB](./peer-b.json)
**Dramatization:**
  - PeerA starts with only the TCP transport enabled on port 10000
  - PeerB starts with only the WebSockets transport enabled on port 10000
  - PeerA and PeerB start handling a '/echo/1.0.0' protocol that echoes back anything it receives
  - PeerA dials to PeerB on '/echo/1.0.0' and fails (incompatible transport)
  - PeerB dials to PeerB on '/echo/1.0.0' and fails (incompatible transport)
  - Both peers shutdown and the test ends
