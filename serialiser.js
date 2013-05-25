var stream = require("stream");

var Serialiser = module.exports = function Serialiser(options) {
  options = options || {};
  options.objectMode = true;

  stream.Transform.call(this, options);
};
Serialiser.prototype = Object.create(stream.Transform.prototype);

Serialiser.prototype._transform = function _transform(input, encoding, done) {
  this.push(this.format_message(input) + "\r\n");

  return done();
};

Serialiser.prototype.format_message = function format_message(message) {
  return [(message.prefix ? ":" + this.format_prefix(message.prefix) + " " : ""), this.format_parameters([message.command].concat(message.parameters || []))].join("");
};

Serialiser.prototype.format_prefix = function format_prefix(prefix) {
  if (prefix.nick && (prefix.user || prefix.server)) {
    return prefix.nick + (prefix.user ? "!" + prefix.user : "") + (prefix.server ? "@" + prefix.server : "");
  } else if (prefix.nick) {
    return prefix.nick;
  } else if (prefix.server) {
    return prefix.server;
  }
};

Serialiser.prototype.format_parameters = function format_parameters(parameters) {
  return parameters.map(function(e) { return ((e.toString().indexOf(" ") !== -1) ? ":" : "") + e; }).join(" ");
};
