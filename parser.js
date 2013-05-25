var stream = require("stream");

var Parser = module.exports = function Parser(options) {
  options = options || {};
  options.objectMode = true;

  stream.Transform.call(this, options);

  this.buffer = "";
};
Parser.prototype = Object.create(stream.Transform.prototype);

Parser.prototype._transform = function _transform(input, encoding, done) {
  input = input.toString();

  this.buffer += input;

  var parts = this.buffer.split(/\r\n/);

  this.buffer = parts.pop();

  var part;
  for (var i=0;i<parts.length;++i) {
    part = parts[i];

    if (part.length > 510) {
      return done(Error("line length is too long"));
    }

    try {
      var message = this.parse(part);
      this.push(message);
    } catch (e) {
      return done(e);
    }
  }

  if (this.buffer.length > 510) {
    return done(Error("line length is too long"));
  }

  return done();
};

var RE_NICK = /^([a-z][a-z0-9\-\[\]\\`^\{\}_]*)(?: |!|@)/i,
    RE_USER = /^([^ \r\n@]+)/,
    RE_SERVER = /^((?:[a-z][a-z0-9-]*\.)*(?:[a-z][a-z0-9-]*))/i,
    RE_COMMAND = /^(\d{3}|[A-Z]+)/;

Parser.prototype.parse = function parse(text, state) {
  if (typeof state !== "object" || state === null) { state = {offset: 0}; }

  var message = {};

  if (text[state.offset] === ":") {
    state.offset++;
    message.prefix = this.parse_prefix(text, state);
  }

  message.command = this.parse_command(text, state);

  message.parameters = this.parse_parameters(text, state);

  return message;
};

Parser.prototype.parse_prefix = function parse_prefix(text, state) {
  var prefix = {};

  var nick;

  if (nick = this.parse_nick(text, state)) {
    prefix.nick = nick;

    if (text[state.offset] === "!") {
      state.offset++;
      prefix.user = this.parse_user(text, state);
    }

    if (text[state.offset] === "@") {
      state.offset++;
      prefix.server = this.parse_server(text, state);
    }
  } else {
    prefix.server = this.parse_server(text, state);
  }

  if (text[state.offset] !== " ") {
    throw new Error("expected whitespace after prefix information");
  }

  while (text[state.offset] === " ") {
    state.offset++;
  }

  return prefix;
};

Parser.prototype.parse_nick = function parse_nick(text, state) {
  var nick = (RE_NICK.exec(text.substr(state.offset)) || {})[1];

  if (nick) {
    state.offset += nick.length;
  }

  return nick;
};

Parser.prototype.parse_user = function parse_user(text, state) {
  var user = (RE_USER.exec(text.substr(state.offset)) || {})[1];

  if (user) {
    state.offset += user.length;
  }

  return user;
};

Parser.prototype.parse_server = function parse_server(text, state) {
  var server = (RE_SERVER.exec(text.substr(state.offset)) || {})[1];

  if (server) {
    state.offset += server.length;
  }

  return server;
};

Parser.prototype.parse_command = function parse_command(text, state) {
  var command = (RE_COMMAND.exec(text.substr(state.offset)) || {})[1];

  if (command) {
    state.offset += command.length;
  }

  while(text[state.offset] === " ") {
    state.offset++;
  }

  return command;
};

Parser.prototype.parse_parameters = function parse_parameters(text, state) {
  var parameters = [];

  while (state.offset < text.length) {
    var parameter = null;

    if (text[state.offset] === ":") {
      state.offset++;
      parameter = text.substr(state.offset);
    } else {
      parameter = (text.substr(state.offset).match(/^(\S+)/) || {})[1];
    }

    if (typeof parameter === "string") {
      parameters.push(parameter);
      state.offset += parameter.length;
    }

    while (text[state.offset] === " ") {
      state.offset++;
    }
  }

  return parameters;
};
