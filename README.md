# KCommands
Command handler for [Discord.js](https://discord.js.org/)


## What
Handle slash commands or legacy commands in the easiest way possible.

## How

### Install the package in your project
```bash
npm install @kanagrou/commands
```

### Create the command handler instance in your main JavaScript file
```js
new KCommandManager(
	client, // Discord.js Client
	{
		dir: path.join(__dirname, 'commands'),
		prefix: '.',
		guild: 'YourGuildId',
		owners: ['YourId']
	}
)
```
### Create your command !
*Example \`Echo\` command*
```js
export default {
	name: 'echo',
	description: 'Replies the input',
	
	slash: true,
	
	options: `message<string>[Message to echo.](required) &
			  channel<channel>[Channel to send the message in.](channeltypes:0)`
	
	listener: async ({interaction}, {message, channel}) => {
		if (channel) await channel.send(message)
		else interaction.channel.send(message)
	}		  
}
```
### Your good to go!
