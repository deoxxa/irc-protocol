var assert = require("assert");

var IRCProtocol = require("../");

describe("regressions", function() {
  var parser, serialiser;

  beforeEach(function() {
    parser = new IRCProtocol.Parser();
    serialiser = new IRCProtocol.Serialiser();
  });

  it("parser should work with more than one write", function(done) {
    var read = 0;

    parser.on("readable", function() {
      while (parser.read() !== null) {
        read++;
      }

      if (read >= 2) {
        return done();
      }
    });

    setTimeout(function() { parser.write("VERSION\r\n"); }, 5);
    setTimeout(function() { parser.write("VERSION\r\n"); }, 10);
  });
});
