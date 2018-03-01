# discord-command-parser
Parses commands from messages received with discord.js

[![npm](https://img.shields.io/npm/dt/discord-command-parser.svg?style=for-the-badge)](https://npmjs.com/package/discord-command-parser)
[![npm](https://img.shields.io/npm/v/discord-command-parser.svg?style=for-the-badge)](https://npmjs.com/package/discord-command-parser)
[![discord](https://img.shields.io/badge/Discord-Join-blue.svg?style=for-the-badge)](https://discord.gg/epyQWQy)


# Installation
With npm:
```css
$ npm install --save discord-command-parser
```
With Yarn:
```css
$ yarn add discord-command-parser
```

# Quick Example
```js
const Discord = require('discord.js');
const dcParser = require('discord-command-parser');

const myPrefix = '!';

const client = new Discord.Client();
client.login('token');

client.on('ready', () => {
  client.on('message', message => {
    let parsed = dcParser.parse(message, myPrefix);
    if (!parsed.success) return;

    if (parsed.command === 'ping') {
      return message.reply('Pong!');
    }
  });

  console.log('Bot ready!');
});
```

# Documentation
> **Important**: 
> 
> The typing (.d.ts) file for this module uses the Master branch of Discord.js, and you should too! If you haven't already updated your bot to use the master branch, do so now with 
>
> `$ npm i -S discordjs/discord.js`
>
> or, if you're using Yarn:
>
> `$ yarn add discordjs/discord.js`

## `parse`
```js
dcParser.parse(message, prefix, options);
```
### Returns: <a href="#ParsedMessage">`dcParser.ParsedMessage`</a>
### Arguments:
 - `message` ***Discord.js#Message***
  
   The message to parse. Must be an instance of Discord.js#Message that was received by a valid client.
 - `prefix` ***string***
   
   The prefix string to check that commands start with. For example, the command `!ping` has a prefix of `!`.
 - `options` ***Object***, ***optional*** - default `{}`
  
   Additional flags for the parser.
   - `allowBots` ***boolean***, ***optional*** - default `false`
      
        Whether to consider and parse messages sent by bot accounts.

   - `allowSelf` ***boolean***, ***optional*** - default `false`
      
        Whether to consider and parse messages sent by the same account that received it.

## `ParsedMessage`

***Class***

Used internally and returned by <a href="#parse">`dcParser.parse`</a>

### Properties:
  - `success` ***boolean***

      Whether the message could be parsed and appears to be a valid command.
  - `prefix` ***string***

      This is redundant to the prefix that was provided to <a href="#parse">`parse`</a>.
  - `command` ***string***
  
      The command that was parsed from the message. For example, the message `!ping` would have a `command` value of `ping`.
  - `arguments` ***string[]***

      An array of whitespace or quote delimited arguments that were passed to the command. For example, the command
      ```
      !ban Clyde 7d "repeated spam of \"no u\" after warning"
      ```
      would have an `arguments` value of:
      ```json
      [
        "Clyde",
        "7d",
        "repeated spam of \"no u\" after warning"
      ]
      ```
  - `error` ***string***
  
      If `success` is `false`, a description of why the message was rejected. Otherwise empty.
  - `code` ***number***, <a href="#ResultCode">ResultCode</a>

      A number from the <a href="#ResultCode">`ResultCode`</a> enum that indicates the detailed result of the parsing.
  - `body` ***string***

      The unparsed body of the message immediately following the `command`.
  - `message` ***Discord.js#Message***

      Redundant to the message that was passed to <a href="#parse">`parse`</a>.
## `ResultCode`
```js
dcParser.ResultCode
```

***enum***, indicates the result of parsing.

### Values
  - `OK: 0`

      The message was parsed without incident, and appears to be a valid command.
  - `BOT_USER: 1`

      The message was sent by a bot account. You can override this check in <a href="#ParserOptions">`ParserOptions`</a>.
  - `SELF_MESSAGE: 2`

      The message was sent the same user that received it. You can override this check in <a href="#ParserOptions">`ParserOptions`</a>.
  - `NO_PREFIX_MATCH: 3`

      The message did not start with the prefix provided.
  - `NO_BODY: 4`

      The message contained *only* the prefix, and nothing more.
  - `WHITESPACE_AFTER_PREFIX: 5`

      The message started with the prefix, but had whitespace immediately following it.
  - `UNKNOWN_ERROR: 6`

      An unknown error occurred while parsing the message, this is likely to be a bug with discord-command-parser, and should be reported to the [Issues page](https://github.com/Shinobu1337/discord-command-parser/issues) on GitHub.

-----

> ## Example Result
> 
> Suppose we got this message on Discord:
> ```
> !remindme "collect daily reward and tell Nyanco \"Happy Valentine's Day!\"" 24h urgent
> ```
> 
> (Assuming our `prefix` is `!`)
>
> This is our resulting <a href="#ParsedMessage">`ParsedMessage`</a>:
> ```json
> {
>   "success": true,
>   "prefix": "!",
>   "command": "remindme",
>   "arguments": [
>     "collect daily reward and tell Nyanco \"Happy Valentine's Day!\"",
>     "24h",
>     "urgent"
>   ],
>   "error": "",
>   "code": 0,
>   "body": "\"collect daily reward and tell Nyanco \\\"Happy Valentine's Day!\\\"\" 24h urgent"
> }
>
> ```

