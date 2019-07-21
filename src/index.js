// https://npmjs.com/package/discord-command-parser
// https://github.com/campbellbrendene/discord-command-parser
// Licensed under the MIT license. See "LICENSE" in the root of this project.

// TODO: Remove all regexps. Use procedural code instead to simplify.
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

function parse(message, prefix, options = {}) {
	function fail(error, code) {
		const result = new ParsedMessage();
		result.success = false;
		result.message = message;
		result.prefix = prefix;
		result.error = error;
		result.code = code;
		return result;
	}

	if (message.author.bot && !options.allowBots) {
		return fail('Message sent by a bot account.', ResultCode.BOT_USER);
	} else if (message.author.id === message.client.user.id && !options.allowSelf) {
		return fail('Message sent from client\'s account.', ResultCode.SELF_MESSAGE);
	} else if (message.content.length  === 0) {
		return fail('Empty message body.', ResultCode.NO_BODY);
	} else if (!message.content.startsWith(prefix)) {
		return fail('Message does not start with prefix.', ResultCode.NO_PREFIX_MATCH);
	}

	let remaining = message.content.slice(prefix.length);

	if (remaining.length === 0) {
		return fail('No body after prefix.', ResultCode.NO_BODY);
	} else if (!/[a-z0-9]/i.test(remaining[0])) {
		return fail('Non alphanumeric character follows prefix.', ResultCode.NO_APLHANUMERIC_AFTER_PREFIX);
	}

	const parsed = new ParsedMessage();

	parsed.command = remaining.match(/^[a-z0-9\-_\.]+/i)[0];
	remaining = remaining.slice(parsed.command.length).trim();

	parsed.success = true;
	parsed.code = ResultCode.OK;
	parsed.prefix = prefix;
	parsed.arguments = getArgs(remaining);
	parsed.body = remaining;
	parsed.message = message;

	return parsed;
}

function getArgs(str) {
	if (!str.trim().length) return [];
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
