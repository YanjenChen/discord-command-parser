// separates arguments with full "quote and \"escape\" support."
const RE_ARG_MATCHER = /"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|```((.|\s)*?)```|\S+/g

// similar, but only matches the command name
const RE_CMD_MATCHER = /^"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|\S+/

// trims " and " from the start and end of a string
const RE_QUOTE_STRIP = /^"|"$|^'|'$|^```|```$/g

// test if string starts with whitespace.
const RE_STARTS_WITH_WHITESPACE = /^\s/

// made by Xzlash - <xzl4sh gmail com>

const codes = Object.freeze({
  OK: 0,
  BOT_USER: 1,
  SELF_MESSAGE: 2,
  NO_PREFIX_MATCH: 3,
  NO_BODY: 4,
  WHITESPACE_AFTER_PREFIX: 5,
  UNKNOWN_ERROR: 6,
  
  0: 'OK',
  1: 'BOT_USER',
  2: 'SELF_MESSAGE',
  3: 'NO_PREFIX_MATCH',
  4: 'NO_BODY',
  5: 'WHITESPACE_AFTER_PREFIX',
  6: 'UNKNOWN_ERROR'
})

function parse (prefix, {author, client, content}, {allowSelf = false} = {}) {
  const result = {
    //success: null,
    //prefix: null,
    //command: null,
    //arguments: null,
    //error: null,
    //code: null,
    //body: null
  }
  try {
    if (author.bot) {
      result.success = false
      result.error = 'bot user'
      result.code = codes.BOT_USER
      return result
    }
    
    if ((!allowSelf) && author.id === client.user.id) {
      result.success = false
      result.error = 'message sent from self'
      result.code = codes.SELF_MESSAGE
      return result
    }
    
    if (!content.startsWith(prefix)) {
      result.success = false
      result.error = 'content does not begin with prefix'
      result.code = codes.NO_PREFIX_MATCH
      return result
    }

    // now we parse the message
    
    let remaining = content.slice(prefix.length)
    if (!remaining.length) {
      result.success = false
      result.error = 'no body to message, only a prefix'
      result.code = codes.NO_BODY
      return result
    }
    
    if (RE_STARTS_WITH_WHITESPACE.test(remaining)) {
      result.success = false
      result.error = 'whitespace after prefix'
      result.code = codes.WHITESPACE_AFTER_PREFIX
      return result
    }
    
    let args = getArgs(remaining)
    
    result.success = true
    result.code = 'OK';
    result.prefix = prefix
    result.command = args.shift() // the command is the first item in the array ;)
    result.arguments = args
    result.body = getBody(remaining)
    
    return result
  } catch (e) {
    result.success = false
    result.error = e.stack
    result.code = codes.UNKNOWN_ERROR
    return result
  }
}

function getBody (str) {
  // remove the command name
  return str.replace(RE_CMD_MATCHER, '')
}

function getArgs (str) {
  // get the arguments using the magic regex
  let splitted = str.match(RE_ARG_MATCHER)
  
  // map it to remove the quotes (if any)
  return splitted.map(v => v.replace(RE_QUOTE_STRIP, ''))
}

module.exports = parse
module.exports.codes = codes
