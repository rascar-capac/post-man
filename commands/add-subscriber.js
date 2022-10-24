const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('subscribe')
        .setDescription('Subscribes a user to the emails sent by PostMan')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user you want to subscribe')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('address')
                .setDescription('The user\'s email address')
                .setRequired(true)),
    async execute(interaction) {
        const newUser = interaction.options.getUser('user');
        interaction.client.subscribers.set(newUser, interaction.options.getString('address'));
        await interaction.reply(`${newUser}'s email address is now subscribed to PostMan !`);
    },
};