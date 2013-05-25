IRC-Protocol [![build status](https://travis-ci.org/deoxxa/irc-protocol.png)](https://travis-ci.org/deoxxa/irc-protocol)
============

Streaming parser and serialiser for IRC protocol data.

Overview
--------

This module allows you to consume and produce IRC protocol messages. It doesn't
contain any logic, leaving that up to the developer. Also everything is streams.

Installation
------------

Available via [npm](http://npmjs.org/):

> $ npm install irc-protocol

Or via git:

> $ git clone git://github.com/deoxxa/irc-protocol.git node_modules/irc-protocol

Usage
-----

Also see [proxy.js](https://github.com/deoxxa/irc-protocol/blob/master/proxy.js).

```javascript
#!/usr/bin/env node

var net = require("net"),
    IRCProtocol = require("./index");

var server = net.createServer(function(local) {
  var local_parser = new IRCProtocol.Parser(),
      remote_parser = new IRCProtocol.Parser(),
      local_serialiser = new IRCProtocol.Serialiser(),
      remote_serialiser = new IRCProtocol.Serialiser();

  var remote = net.createConnection(6667, "127.0.0.1");

  local.pipe(local_parser).pipe(local_serialiser).pipe(remote);
  remote.pipe(remote_parser).pipe(remote_serialiser).pipe(local);

  local_serialiser.on("data", function(data) { process.stdout.write(">> " + data); });
  remote_serialiser.on("data", function(data) { process.stdout.write("<< " + data); });
});

server.listen(6668);
```

License
-------

3-clause BSD. A copy is included with the source.

Contact
-------

* GitHub ([deoxxa](http://github.com/deoxxa))
* Twitter ([@deoxxa](http://twitter.com/deoxxa))
* ADN ([@deoxxa](https://alpha.app.net/deoxxa))
* Email ([deoxxa@fknsrs.biz](mailto:deoxxa@fknsrs.biz))
