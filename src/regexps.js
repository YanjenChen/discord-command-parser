/** separates arguments with full "quote and \"escape\" support." Including \`\`\`codeblocks\`\`\` */
const RE_ARG_MATCHER = /"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|```((.|\s)*?)```|\S+/g;

/** similar to `RE_ARG_MATCHER`, but only matches the command name */
const RE_CMD_MATCHER = /^[a-z0-9]+/gi;

/** trims pairs of quotes from the start and end of a string */
const RE_QUOTE_STRIP = /^"|"$|^'|'$|^```(\S*\n?)|```$/g;

/** test if string starts with whitespace. */
const RE_STARTS_WITH_WHITESPACE = /^\s/;

module.exports = {
	RE_ARG_MATCHER,
	RE_CMD_MATCHER,
	RE_QUOTE_STRIP,
	RE_STARTS_WITH_WHITESPACE
};
