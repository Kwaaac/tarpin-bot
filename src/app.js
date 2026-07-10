import 'dotenv/config';

import {Client, Events, GatewayIntentBits} from 'discord.js';
import {User} from "discord.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});


/* Définition des listeners */
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    readyClient.user.setActivity('Destructeur de scammeur')
});

client.on(Events.MessageCreate, (message) => {
    // Guard cause for DM
    if(!message.inGuild()) return;

    // Guard cause for the honeypot channel
    if (message.channelId !== process.env.HONEY_POT_ID) return;


    let scammerMember = message.member;
    // Guard cause for the bot itself or for user with the immunity role
    if(message.author.id === client.user.id || scammerMember.roles.cache.has(process.env.IMMUNITY_ROLE))return;
    message.delete();
    scammerMember.kick("Talked in HoneyPot").then(r => "Kicked member")
});

client.login(process.env.TOKEN);


