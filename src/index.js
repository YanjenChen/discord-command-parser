// https://npmjs.com/package/discord-command-parser
// https://github.com/Shinobu1337/discord-command-parser
// Licensed under the MIT license. See "LICENSE" in the root of this project.

const regexps = require('./regexps');
const ParsedMessage = require('./ParsedMessage');

const ResultCode = Object.freeze({
  OK: 0,
  BOT_USER: 1,
  SELF_MESSAGE: 2,
  NO_PREFIX_MATCH: 3,
  NO_BODY: 4,
  NO_APLHANUMERIC_AFTER_PREFIX: 5,
  UNKNOWN_ERROR: 6,

  get WHITESPACE_AFTER_PREFIX () {
    // deprecation error
    throw new Error
      ('DeprecationError: Please use dcParser.ResultCode.NO_APLHANUMERIC_AFTER_PREFIX instead of WHITESPACE_AFTER_PREFIX');
  }

});

function parse (message, prefix, options = {}) {
  function fail (error, code) {
    const result = new ParsedMessage();
    result.success = false;
    result.message = message;
    result.prefix = prefix;
    result.error = error;
    result.code = code;

    return result;
  }

  try {
    // check for bot user
    if ((!options.allowBots) && message.author.bot)
      return fail('bot user', ResultCode.BOT_USER);
    
    // check for self message
    if ((!options.allowSelf) && message.author.id === message.client.user.id) 
      return fail('message sent from self', ResultCode.SELF_MESSAGE);
    
    // check for prefix match
    if (!message.content.startsWith(prefix))
      return fail('content does not begin with prefix', ResultCode.NO_PREFIX_MATCH);
    
    // remove the prefix from the beginning
    let remaining = message.content.slice(prefix.length);

    // make sure that there's more to the message
    if (!remaining.length)
      return fail('no body to message, only a prefix', ResultCode.NO_BODY);
    
    /*

    // make sure that the first character after the prefix is a non-whitespace character
    if (regexps.RE_STARTS_WITH_WHITESPACE.test(remaining))
      return fail('whitespace after prefix', ResultCode.WHITESPACE_AFTER_PREFIX);
    
    */

    // https://github.com/Shinobu1337/discord-command-parser/issues/4

    if (!regexps.RE_CMD_MATCHER.test(remaining))
      return fail('non-alphanumeric character follows prefix', ResultCode.NO_APLHANUMERIC_AFTER_PREFIX);

    
    let result = new ParsedMessage();
    
    // get command
    result.command = remaining.match(regexps.RE_CMD_MATCHER)[0];
    // remove command from remaining
    remaining = remaining.slice(result.command.length).trim();

    result.success = true
    result.code = 'OK';
    result.prefix = prefix;
    result.arguments = getArgs(remaining);
    result.body = remaining;
    result.message = message;
    
    return result;

  } catch (e) {
  
    return fail(e.stack, ResultCode.UNKNOWN_ERROR);
  
  }
}

function getArgs (str) {
  // get the arguments using the magic regex
  let splitted = str.match(regexps.RE_ARG_MATCHER);
  
  // map it to remove the quotes (if any)
  return splitted.map(v => v.replace(regexps.RE_QUOTE_STRIP, ''));
}

class ParserOptions {}; // for typings

module.exports.ParserOptions = ParserOptions;
module.exports.parse = parse;
module.exports.ResultCode = ResultCode;
module.exports.ParsedMessage = ParsedMessage;
