# discord-command-parser
Basic parsing for messages received with discord.js

[![npm](https://img.shields.io/npm/dt/discord-command-parser.svg?style=for-the-badge)](https://npmjs.com/package/discord-command-parser)
[![npm](https://img.shields.io/npm/v/discord-command-parser.svg?style=for-the-badge)](https://npmjs.com/package/discord-command-parser)
[![discord](https://img.shields.io/badge/Discord-Join-blue.svg?style=for-the-badge)](https://discord.gg/epyQWQy)

### Example
```js
const Discord = require('discord.js')
const CommandParser = require('discord-command-parser')

const myPrefix = '!'

const Bot = new Discord.Client()

async function main () {
  await Bot.login('[Insert Bot Token Here]')
  Bot.on('message', async message => {
    const cmd = CommandParser(myPrefix, message)
    
    if (!cmd.success) return false
    
    switch (cmd.command) {
      case 'ping':
        return message.reply('Pong!')
      case 'debug':
        return message.reply('```' + JSON.stringify(cmd) + '```')
      default:
        return
    }
  })
  
  console.log('Ready!')
}

main()

```
### API
```js
CommandParser(<prefix>, <message> [, options])
```
 - `prefix` is the prefix to check that a message starts with.
 - `message` is an instance of [discord.js#Message](https://discord.js.org/#/docs/main/master/class/Message)
 - `options` is an optional argument, which takes an object with the following values:
   - `allowSelf` (default: `false`) - If true, the parser will **NOT** throw an error if the message author is the same as the message client (useful when making a selfbot).
   - `allowBots` (default: `false`) - If `true`, the parser will **NOT** throw an error if the message author is a bot account (does not override `allowSelf`).

The parser returns an object, with the following values:
 - If there was an error:
   - `success` = `false`
   - `code` - One of 
     - `BOT_USER`
     - `SELF_MESSAGE`
     - `NO_PREFIX_MATCH`
     - `NO_BODY`
     - `WHITESPACE_AFTER_PREFIX`
     - `UNKNOWN_ERROR`
   - `error` - A description of the error
 - If there was no error:
   - `success` = `true`
   - `code` = `OK`
   - `prefix` - The prefix you specified
   - `command` - The first word after the prefix
   - `arguments` - An array of arguments passed to the command, handling 
  ```
  "multi-word arguments and \"escaping\""
  ```

  as well as single word arguments and even code blocks!
   - `body` - the body of the message, minus the prefix and command.


#### If you need help, feel free to join my Discord server (link at top), and I'll try to help you out ^_^
