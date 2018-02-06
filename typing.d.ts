import {Message} from 'discord.js';

declare module 'discord-command-parser' {
  export function parse (
    prefix: string,
    message: Message,
    options?: ParserOptions
  ): ParsedMessage;

  export class ParsedMessage {
    success: boolean;
    prefix: string;
    command: string;
    arguments: string[];
    error: string;
    code: string;
    body: string;
    message: Message;
  }

  export class ParserOptions {
    allowSelf?: boolean;
    allowBots?: boolean;
  }

  export enum ResultCode {
    OK,
    BOT_USER,
    SELF_MESSAGE,
    NO_PREFIX_MATCH,
    NO_BODY,
    WHITESPACE_AFTER_PREFIX,
    UNKNOWN_ERROR
  }
}