import {Message} from 'discord.js';

declare class ParsedMessage {
  success: boolean;
  prefix: string;
  command: string;
  arguments: string[];
  error: string;
  code: string;
  body: string;
  message: Message;
}

declare class ParserOptions {
  allowSelf?: boolean;
  allowBots?: boolean;
}

declare module 'discord-command-parser' {
  function parse (
    prefix: string,
    message: Message,
    options: ParserOptions = {}
  ): ParsedMessage;
  export = parse;
}