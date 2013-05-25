var assert = require("assert"),
    stream = require("stream");

var IRCProtocol = require("../");

describe("serialiser", function() {
  var serialiser;

  beforeEach(function() {
    serialiser = new IRCProtocol.Serialiser();
  });

  it("should serialise a message with a command", function(done) {
    serialiser.on("readable", function() {
      var message = serialiser.read();

      if (message !== "VERSION\r\n") {
        return done(Error("incorrect output"));
      }

      return done();
    });

    serialiser.write({command: "VERSION"});
  });

  it("should serialise a message with a command and one parameter", function(done) {
    serialiser.on("readable", function() {
      var message = serialiser.read();

      if (message !== "VERSION a.b.c\r\n") {
        return done(Error("incorrect output"));
      }

      return done();
    });

    serialiser.write({command: "VERSION", parameters: ["a.b.c"]});
  });

  it("should serialise a message with a command and two parameters", function(done) {
    serialiser.on("readable", function() {
      var message = serialiser.read();

      if (message !== "VERSION a.b.c d.e.f\r\n") {
        return done(Error("incorrect output"));
      }

      return done();
    });

    serialiser.write({command: "VERSION", parameters: ["a.b.c", "d.e.f"]});
  });

  it("should serialise a message with a command and a long parameter", function(done) {
    serialiser.on("readable", function() {
      var message = serialiser.read();

      if (message !== "VERSION :this is a long parameter\r\n") {
        return done(Error("incorrect output"));
      }

      return done();
    });

    serialiser.write({command: "VERSION", parameters: ["this is a long parameter"]});
  });

  it("should serialise a message with a command, a short parameter, and a long parameter", function(done) {
    serialiser.on("readable", function() {
      var message = serialiser.read();

      if (message !== "VERSION #hello :this is a long parameter\r\n") {
        return done(Error("incorrect output"));
      }

      return done();
    });

    serialiser.write({command: "VERSION", parameters: ["#hello", "this is a long parameter"]});
  });

  it("should serialise a message with a server prefix", function(done) {
    serialiser.on("readable", function() {
      var message = serialiser.read();

      if (message !== ":irc.example.com VERSION\r\n") {
        return done(Error("incorrect output"));
      }

      return done();
    });

    serialiser.write({prefix: {server: "irc.example.com"}, command: "VERSION"});
  });

  it("should serialise a message with a nick prefix", function(done) {
    serialiser.on("readable", function() {
      var message = serialiser.read();

      if (message !== ":nick VERSION\r\n") {
        return done(Error("incorrect output"));
      }

      return done();
    });

    serialiser.write({prefix: {nick: "nick"}, command: "VERSION"});
  });

  it("should serialise a message with a nick and a user prefix", function(done) {
    serialiser.on("readable", function() {
      var message = serialiser.read();

      if (message !== ":nick!user VERSION\r\n") {
        return done(Error("incorrect output"));
      }

      return done();
    });

    serialiser.write({prefix: {nick: "nick", user: "user"}, command: "VERSION"});
  });

  it("should serialise a message with a nick and a server prefix", function(done) {
    serialiser.on("readable", function() {
      var message = serialiser.read();

      if (message !== ":nick@server VERSION\r\n") {
        return done(Error("incorrect output"));
      }

      return done();
    });

    serialiser.write({prefix: {nick: "nick", server: "server"}, command: "VERSION"});
  });

  it("should serialise a message with a nick, a user, and a server prefix", function(done) {
    serialiser.on("readable", function() {
      var message = serialiser.read();

      if (message !== ":nick!user@server VERSION\r\n") {
        return done(Error("incorrect output"));
      }

      return done();
    });

    serialiser.write({prefix: {nick: "nick", user: "user", server: "server"}, command: "VERSION"});
  });
});
