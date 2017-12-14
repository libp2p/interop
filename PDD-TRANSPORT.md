# Transports - Compliance Test Stories

## Table of Contents

## Story 1 - Two nodes start, one dials the other using TCP

**Cast:**
  - PeerA
  - PeerB
**Dramatization:**
  - PeerA and PeerB start a libp2p Node with only the TCP transport enabled on port 10000 and 10001 respectively
  - PeerA dials to PeerB
  - PeerA recognizes it has a dial to PeerB. PeerB can't recognize PeerA neither CryptoAuth or Identify are Enabled
  - PeerA ends the connection graciously
  - PeerB receives the connection and ends the connection too
  - Both peers shutdown and the test ends

## Story 2 - Two nodes start, one dials the other using WebSockets

**Cast:**
  - PeerA
  - PeerB
**Dramatization:**
  - PeerA and PeerB start a libp2p Node with only the WebSockets transport enabled on port 10000 and 10001 respectively
  - PeerA dials to PeerB
  - PeerA recognizes it has a dial to PeerB. PeerB can't recognize PeerA neither CryptoAuth or Identify are Enabled
  - PeerA ends the connection graciously
  - PeerB receives the connection and ends the connection too
  - Both peers shutdown and the test ends

## Story 3 - Two nodes start, one dials the other but fails due to lack of a mutual supported transport.

**Cast:**
  - PeerA
  - PeerB
**Dramatization:**
  - PeerA starts with only the TCP transport enabled on port 10000
  - PeerA starts with only the WebSockets transport enabled on port 10000
  - PeerA dials to PeerB and fails
  - Both peers shutdown and the test ends

