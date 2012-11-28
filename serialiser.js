var Steez = require("steez"),
    util = require("util");

var Serialiser = module.exports = function Serialiser() {
  Steez.call(this);
};
util.inherits(Serialiser, Steez);

Serialiser.prototype.write = function write(message) {
  this.emit("data", this.format_message(message) + "\r\n");

  return this.writable && !this.paused;
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
