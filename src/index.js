// https://npmjs.com/package/discord-command-parser
// https://github.com/campbellbrendene/discord-command-parser
// Licensed under the MIT license. See "LICENSE" in the root of this project.

const regexps		=	require('./regexps');
const ParsedMessage	=	require('./ParsedMessage');

const ResultCode = Object.freeze({
	OK:								0,
	BOT_USER:						1,
	SELF_MESSAGE:					2,
	NO_PREFIX_MATCH:				3,
	NO_BODY:						4,
	NO_APLHANUMERIC_AFTER_PREFIX:	5,
	UNKNOWN_ERROR:					6,
});

function parse (message, prefix, options = {}) {
	function fail (error, code) {
		const result	=	new ParsedMessage();
		result.success	=	false;
		result.message	=	message;
		result.prefix	=	prefix;
		result.error	=	error;
		result.code		=	code;
		return result;
	}

	try {
		// check for bot user
		if (!options.allowBots && message.author.bot)
			return fail('bot user', ResultCode.BOT_USER);
		
		// check for self message
		if (!options.allowSelf && message.author.id === message.client.user.id) 
			return fail('message sent from self', ResultCode.SELF_MESSAGE);
		
		// check for prefix match
		if (!message.content.startsWith(prefix))
			return fail('content does not begin with prefix', ResultCode.NO_PREFIX_MATCH);
		
		// remove the prefix from the beginning
		let remaining = message.content.slice(prefix.length);

		// make sure that there's more to the message
		if (!remaining.length)
			return fail('no body to message, only a prefix', ResultCode.NO_BODY);

		if (!regexps.RE_CMD_MATCHER.test(remaining))
			return fail('non-alphanumeric character follows prefix', ResultCode.NO_APLHANUMERIC_AFTER_PREFIX);

		
		let result = new ParsedMessage();
		
		// get command
		result.command = remaining.match(regexps.RE_CMD_MATCHER)[0];
		// remove command from remaining
		remaining = remaining.slice(result.command.length).trim();

		result.success		=	true
		result.code			=	ResultCode.OK;
		result.prefix		=	prefix;
		result.arguments	=	getArgs(remaining);
		result.body			=	remaining;
		result.message		=	message;
		
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

// For typings
class ParserOptions {
	constructor() {
		throw new TypeError('ParserOptions is an interface and cannot be constructed.');
	}
}

module.exports = {
	ParserOptions,
	parse,
	ResultCode,
	ParsedMessage,
};

module.exports.ParserOptions	= ParserOptions;
module.exports.parse			= parse;
module.exports.ResultCode 		= ResultCode;
module.exports.ParsedMessage	= ParsedMessage;
