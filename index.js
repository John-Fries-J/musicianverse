const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token, joinleaveChannelID } = require('./config.json');
const { purple } = require('./colors.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMembers] });
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on('guildMemberAdd', member => {
    const channelId = joinleaveChannelID;
    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return console.log('No join leave channel detected');
	const welcomeEmbed = new EmbedBuilder()
	.setTitle('Welcome into the Musician-Verse!')
	.setDescription(`To get started follow these steps:\n- Have a read of <#1067046161380282388> and <#1067082006141358140>.\n- Customise your profile with roles in <#1067084911917420544>.\n- Introduce yourself in <#1067059509752766535>.`)
	.setColor(purple);
    channel.send({content: `Hey ${member}!`, embeds: [welcomeEmbed] });
});

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
if (!token) {
	console.log('[ERROR] No token provided in config.json');
	process.exit(1);
}
client.login(token);