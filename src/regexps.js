/** separates arguments with full "quote and \"escape\" support." Including \`\`\`codeblocks\`\`\` */
const RE_ARG_MATCHER = /"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|```((.|\s)*?)```|\S+/g;

/** trims pairs of quotes from the start and end of a string */
const RE_QUOTE_STRIP = /^"|"$|^'|'$|^```(\S*\n?)|```$/g;

module.exports = {
	RE_ARG_MATCHER,
	RE_QUOTE_STRIP,
};
