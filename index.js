// https://npmjs.com/package/discord-command-parser
// https://github.com/xzlash/discord-command-parser
// Licensed under the MIT license. See "LICENSE" in the root of this project.
// made by Xzlash - <xzl4sh [at] gmail [dot] com> - Discord:Xzlash#5321 / https://discord.gg/epyQWQy

/** separates arguments with full "quote and \"escape\" support." Including \`\`\`codeblocks\`\`\` */
const RE_ARG_MATCHER = /"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|```((.|\s)*?)```|\S+/g;

/** similar to `RE_ARG_MATCHER`, but only matches the command name */
const RE_CMD_MATCHER = /^"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|\S+/;

/** trims pairs of quotes from the start and end of a string */
const RE_QUOTE_STRIP = /^"|"$|^'|'$|^```(\S*\n?)|```$/g;

/** test if string starts with whitespace. */
const RE_STARTS_WITH_WHITESPACE = /^\s/;

/**
 * @typedef {Object} ParsedMessage
 * @property {boolean} success Whether the message was parsed without errors
 * @property {string} prefix The prefix the message started with
 * @property {string} command The command name immediately following the prefix
 * @property {string[]} arguments The arguments or parameters passed to the command
 * @property {string} error If `success === false`, a description of the error that occured
 * @property {string} code The result code, `'OK'` if `success === true`
 * @property {string} body The body of the message following the prefix and command, not parsed
 */

/**
 * @typedef {Object} ParserOptions
 * @property {boolean} allowSelf If true, the parser will **NOT** throw an error if the message author is the same as the message client
 * @property {boolean} allowBots If true, the parser will **NOT** throw an error if the message author is a bot account (does not override `allowSelf`)
 */

 /**
  * Parses a message received by Discord.js -- First checking to see if it matches the prefix provided, as well as whether it was sent by a bot, and whether it was sent by the message's client (override in options)
  * @param {string} prefix The prefix to check whether the message starts with
  * @param {*} message An instance of https://discord.js.org/#/docs/main/master/class/Message received by a valid client
  * @param {ParserOptions} options The options for this parsing
  * @returns {ParsedMessage} The parsed message
  */
function parse (prefix, message, options = {}) {
  const result = {
    //success
    //prefix
    //command
    //arguments
    //error
    //code
    //body
  };
  try {
    if ((!options.allowBots) && message.author.bot) {
      result.success = false;
      result.error = 'bot user';
      result.code = 'BOT_USER';
      return result;
    }
    
    if ((!options.allowSelf) && message.author.id === message.client.user.id) {
      result.success = false;
      result.error = 'message sent from self';
      result.code = 'SELF_MESSAGE';
      return result;
    }
    
    if (!message.content.startsWith(prefix)) {
      result.success = false;
      result.error = 'content does not begin with prefix';
      result.code = 'NO_PREFIX_MATCH';
      return result;
    }

    // now we parse the message
    
    let remaining = message.content.slice(prefix.length);
    if (!remaining.length) {
      result.success = false;
      result.error = 'no body to message, only a prefix';
      result.code = 'NO_BODY';
      return result;
    }
    
    if (RE_STARTS_WITH_WHITESPACE.test(remaining)) {
      result.success = false;
      result.error = 'whitespace after prefix';
      result.code = 'WHITESPACE_AFTER_PREFIX';
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
    result.code = 'UNKNOWN_ERROR';
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

module.exports = parse;
