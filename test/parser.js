var assert = require("assert"),
    stream = require("stream");

var IRCProtocol = require("../");

describe("parser", function() {
  var parser;

  beforeEach(function() {
    parser = new IRCProtocol.Parser();
  });

  it("should parse a message with a command", function(done) {
    parser.on("readable", function() {
      var message = parser.read();

      if (message.command !== "VERSION") {
        return done(Error("incorrect command"));
      }

      return done();
    });

    parser.write("VERSION\r\n");
  });

  it("should parse a message with a command and one parameter", function(done) {
    parser.on("readable", function() {
      var message = parser.read();

      if (message.command !== "VERSION") {
        return done(Error("incorrect command"));
      }

      if (message.parameters.length !== 1) {
        return done(Error("incorrect number of parameters"));
      }

      if (message.parameters[0] !== "a.b.c") {
        return done(Error("incorrect parameter content"));
      }

      return done();
    });

    parser.write("VERSION a.b.c\r\n");
  });

  it("should parse a message with a command and two parameters", function(done) {
    parser.on("readable", function() {
      var message = parser.read();

      if (message.command !== "VERSION") {
        return done(Error("incorrect command"));
      }

      if (message.parameters.length !== 2) {
        return done(Error("incorrect number of parameters"));
      }

      if (message.parameters[0] !== "a.b.c") {
        return done(Error("incorrect parameter 0 content"));
      }

      if (message.parameters[1] !== "d.e.f") {
        return done(Error("incorrect parameter 1 content"));
      }

      return done();
    });

    parser.write("VERSION a.b.c d.e.f\r\n");
  });

  it("should parse a message with a command and a long parameter", function(done) {
    parser.on("readable", function() {
      var message = parser.read();

      if (message.command !== "VERSION") {
        return done(Error("incorrect command"));
      }

      if (message.parameters.length !== 1) {
        return done(Error("incorrect number of parameters"));
      }

      if (message.parameters[0] !== "this is a long parameter") {
        return done(Error("incorrect parameter 0 content"));
      }

      return done();
    });

    parser.write("VERSION :this is a long parameter\r\n");
  });

  it("should parse a message with a command, a short parameter, and a long parameter", function(done) {
    parser.on("readable", function() {
      var message = parser.read();

      if (message.command !== "VERSION") {
        return done(Error("incorrect command"));
      }

      if (message.parameters.length !== 2) {
        return done(Error("incorrect number of parameters"));
      }

      if (message.parameters[0] !== "#hello") {
        return done(Error("incorrect parameter 0 content"));
      }

      if (message.parameters[1] !== "this is a long parameter") {
        return done(Error("incorrect parameter 1 content"));
      }

      return done();
    });

    parser.write("VERSION #hello :this is a long parameter\r\n");
  });

  it("should parse a message with a server prefix", function(done) {
    parser.on("readable", function() {
      var message = parser.read();

      if (!message) {
        return done(Error("no message parsed"));
      }

      if (message.command !== "VERSION") {
        return done(Error("incorrect command"));
      }

      if (!message.prefix) {
        return done(Error("prefix not parsed"));
      }

      if (message.prefix.server !== "irc.example.com") {
        return done(Error("invalid server prefix"));
      }

      return done();
    });

    parser.write(":irc.example.com VERSION a.b.c\r\n");
  });

  it("should parse a message with a nick prefix", function(done) {
    parser.on("readable", function() {
      var message = parser.read();

      if (!message) {
        return done(Error("no message parsed"));
      }

      if (message.command !== "VERSION") {
        return done(Error("incorrect command"));
      }

      if (!message.prefix) {
        return done(Error("prefix not parsed"));
      }

      if (message.prefix.nick !== "nick") {
        return done(Error("invalid nick prefix"));
      }

      return done();
    });

    parser.write(":nick VERSION a.b.c\r\n");
  });

  it("should parse a message with a nick and a user prefix", function(done) {
    parser.on("readable", function() {
      var message = parser.read();

      if (!message) {
        return done(Error("no message parsed"));
      }

      if (message.command !== "VERSION") {
        return done(Error("incorrect command"));
      }

      if (!message.prefix) {
        return done(Error("prefix not parsed"));
      }

      if (message.prefix.nick !== "nick") {
        return done(Error("invalid nick prefix"));
      }

      if (message.prefix.user !== "user") {
        return done(Error("invalid user prefix"));
      }

      return done();
    });

    parser.write(":nick!user VERSION a.b.c\r\n");
  });

  it("should parse a message with a nick and a server prefix", function(done) {
    parser.on("readable", function() {
      var message = parser.read();

      if (!message) {
        return done(Error("no message parsed"));
      }

      if (message.command !== "VERSION") {
        return done(Error("incorrect command"));
      }

      if (!message.prefix) {
        return done(Error("prefix not parsed"));
      }

      if (message.prefix.nick !== "nick") {
        return done(Error("invalid nick prefix"));
      }

      if (message.prefix.server !== "server") {
        return done(Error("invalid server prefix"));
      }

      return done();
    });

    parser.write(":nick@server VERSION a.b.c\r\n");
  });

  it("should parse a message with a nick, a user, and a server prefix", function(done) {
    parser.on("readable", function() {
      var message = parser.read();

      if (!message) {
        return done(Error("no message parsed"));
      }

      if (message.command !== "VERSION") {
        return done(Error("incorrect command"));
      }

      if (!message.prefix) {
        return done(Error("prefix not parsed"));
      }

      if (message.prefix.nick !== "nick") {
        return done(Error("invalid nick prefix"));
      }

      if (message.prefix.user !== "user") {
        return done(Error("invalid user prefix"));
      }

      if (message.prefix.server !== "server") {
        return done(Error("invalid server prefix"));
      }

      return done();
    });

    parser.write(":nick!user@server VERSION a.b.c\r\n");
  });
});
