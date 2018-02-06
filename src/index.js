// https://npmjs.com/package/discord-command-parser
// https://github.com/xzlash/discord-command-parser
// Licensed under the MIT license. See "LICENSE" in the root of this project.

const regexps = require('./regexps');
const ParsedMessage = require('./ParsedMessage');

const ResultCode = {
  OK: 0,
  BOT_USER: 1,
  SELF_MESSAGE: 2,
  NO_PREFIX_MATCH: 3,
  NO_BODY: 4,
  WHITESPACE_AFTER_PREFIX: 5,
  UNKNOWN_ERROR: 6
}

function parse (prefix, message, options = {}) {
  const result = new ParsedMessage();
  result.message = message;
  try {
    if ((!options.allowBots) && message.author.bot) {
      result.success = false;
      result.error = 'bot user';
      result.code = ResultCode.BOT_USER;
      return result;
    }
    
    if ((!options.allowSelf) && message.author.id === message.client.user.id) {
      result.success = false;
      result.error = 'message sent from self';
      result.code = ResultCode.SELF_MESSAGE;
      return result;
    }
    
    if (!message.content.startsWith(prefix)) {
      result.success = false;
      result.error = 'content does not begin with prefix';
      result.code = ResultCode.NO_PREFIX_MATCH;
      return result;
    }

    // now we parse the message
    
    let remaining = message.content.slice(prefix.length);
    if (!remaining.length) {
      result.success = false;
      result.error = 'no body to message, only a prefix';
      result.code = ResultCode.NO_BODY;
      return result;
    }
    
    if (RE_STARTS_WITH_WHITESPACE.test(remaining)) {
      result.success = false;
      result.error = 'whitespace after prefix';
      result.code = ResultCode.WHITESPACE_AFTER_PREFIX;
      return result;
    }
    
    let args = getArgs(remaining);
    
    result.success = true
    result.code = 'OK';
    result.prefix = prefix;
    result.command = args.shift(); // the command is the first item in the array ^_^
    result.arguments = args;
    result.body = getBody(remaining);
    
    return result;
  } catch (e) {
    result.success = false;
    result.error = e.stack;
    result.code = ResultCode.UNKNOWN_ERROR;
    return result;
  }
}

function getBody (str) {
  // remove the command name
  return str.replace(RE_CMD_MATCHER, '').trim();
}

function getArgs (str) {
  // get the arguments using the magic regex
  let splitted = str.match(RE_ARG_MATCHER);
  
  // map it to remove the quotes (if any)
  return splitted.map(v => v.replace(RE_QUOTE_STRIP, ''));
}

module.exports.ParserOptions = class ParserOptions {};
module.exports.parse = parse;
module.exports.ResultCode = ResultCode;
module.exports.ParsedMessage = ParsedMessage;
