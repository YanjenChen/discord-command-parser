# discord-command-parser
Basic parsing for messages received with discord.js

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
 - `message` is an instance of <discord.js>#Message
 - `options` is an optional argument, which takes an object with the following values:
   - `allowSelf` (default: `false`) - if `true`, the parser will not return an error if the message is from the client instance that received it (useful for selfbots).

###### return
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
   - `arguments` - An array of arguments passed to the command, these are somewhat glitchy yet, but they do handle "multi-word arguments and \\"escaping\\"" as well as single word arguments and code blocks!
 
 Feel free to join my Discord server if you want lol, it's https://discord.gg/GJSQqDw
