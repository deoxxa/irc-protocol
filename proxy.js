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
