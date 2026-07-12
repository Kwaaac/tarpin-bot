import 'dotenv/config';

import { Client, Events, GatewayIntentBits } from 'discord.js';
import { clearMessages } from './utils.js';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});


/* Définition des listeners */
client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	readyClient.user.setActivity('Destructeur de scammeur');
});

const messageCache = [];

client.on(Events.MessageCreate, (message) => {
	console.log(`Message reçu ! ${message.content}`);
	// Guard cause for DM
	if (!message.inGuild()) return;

	clearMessages(message);
	messageCache.push(message);

	// Guard cause for the honeypot channel
	if (message.channelId !== process.env.HONEY_POT_ID) return;

	const scammerMember = message.member;

	// Guard cause for the bot itself or for user with the immunity role
	if (message.author.id === client.user.id || !scammerMember || scammerMember.roles.cache.has(process.env.IMMUNITY_ROLE)) return;

	// Kick && delete all messages from the user from the cache
	scammerMember.kick('Tu as envoyé un message dans un channel destiné aux scams')
		.then(() => console.log('Kicked member'));

	messageCache.map(msg => {
		if (msg.author.id === message.author.id) {
			msg.delete();
			messageCache.splice(messageCache.indexOf(msg), 1);
		}
	});
});

client.login(process.env.TOKEN);

