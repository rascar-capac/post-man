// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

client.subscribers = new Collection();
client.modalSubmits = new Collection();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    }
    catch (error) {
        await interaction.reply({ content: 'Une erreur est survenue à l’exécution de cette commande !', ephemeral: true });
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;

    const modalSubmitHandler = client.modalSubmits.get(interaction.customId);
    if (!modalSubmitHandler) return;

    try {
        await modalSubmitHandler(interaction);
    }
    catch (error) {
        await interaction.reply({ content: 'Une erreur est survenue à l’interprétation des données reçues !', ephemeral: true });
        console.error(error);
    }
})

// Login to Discord with your client's token
client.login(token);
