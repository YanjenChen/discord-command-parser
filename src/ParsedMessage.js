module.exports = class ParsedMessage {
	constructor () {
		this.success	=	false;
		this.prefix		=	'';
		this.command	=	'';
		this.arguments	=	[];
		this.error		=	'';
		this.code		=	'';
		this.body		=	'';
		this.message	=	null;
	}
}
