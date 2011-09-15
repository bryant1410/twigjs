/*
TwigJS
Author: Fadrizul H. <fadrizul[at]gmail.com>
*/
var Parser, exports, pr, x;
x = require("./regexes");
pr = require("../dev/eyes");
Parser = (function() {
  function Parser(str, tags) {
    this.rawTokens = str ? str.trim().replace(x.Replace, "").split(x.Split) : {};
    this.tags = tags || {};
  }
  Parser.prototype.parseTokens = function() {
    var filterName, filters, i, index, part, parts, stack, tagname, token, varname, _i, _len, _len2, _ref;
    stack = [[]];
    index = 0;
    _ref = this.rawTokens;
    for (i = 0, _len = _ref.length; i < _len; i++) {
      token = _ref[i];
      if (token.length === 0 || x.CmntDelimiter.test(token)) {
        continue;
      }
      if (x.Spaces.test(token)) {
        token = token.replace(RegExp(" +"), " ").replace(/\n+/, "\n");
      } else if (x.twigVar.test(token)) {
        filters = [];
        parts = token.replace(x.VarDelimiter, "").split("|");
        varname = parts.shift();
        for (_i = 0, _len2 = parts.length; _i < _len2; _i++) {
          part = parts[_i];
          if (parts.hasOwnProperty(part)) {
            parts = parts[part];
            filterName = part.match(/^\w+/);
          }
          if (x.LBracket.test(part)) {
            filters.push({
              name: filter_name[0],
              args: part.replace(x.Symbols, "").split(",")
            });
          } else {
            filters.push({
              name: filter_name[0],
              args: []
            });
          }
        }
        token = {
          type: x.VAR_TOKEN,
          name: varname,
          filters: filters
        };
        stack[index].push(token);
      } else if (x.twigLogic.test(token)) {
        parts = token.replace(x.LogDelimiter, "").split(" ");
        tagname = parts.shift();
        if (tagname === "endblock") {
          index--;
          stack.pop;
          continue;
        }
        if (!(tagname in this.tags)) {
          throw new Error("Unknown logic tag: " + tagname + " ");
        }
        token = {
          type: x.LOGIC_TOKEN,
          name: tagname,
          args: parts.length ? parts : [],
          compile: this.tags[tagname]
        };
        if (this.tags[tagname].ends) {
          token.tokens = this.rawTokens[i + 1];
          stack[index].push(token);
          index++;
          continue;
        }
      } else {
        stack[index].push(token);
      }
    }
    return stack[index];
  };
  return Parser;
})();
Parser = exports = module.exports = Parser;
exports.TEMPLATE = x.TEMPLATE;
exports.TOKEN_TYPES = {
  TEMPLATE: x.TEMPLATE,
  LOGIC: x.LOGIC_TOKEN,
  VAR: x.VAR_TOKEN
};