const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unsubscribe')
        .setDescription('Unsubscribes a user from the emails sent by PostMan')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user you want to unsubscribe')
                .setRequired(true)),
    async execute(interaction) {
        const userToUnsubscribe = interaction.options.getUser('user');
        if (interaction.client.subscribers.delete(userToUnsubscribe)) {
            await interaction.reply(`${userToUnsubscribe}'s email address is no longer subscribed to PostMan!`);
        }
        else {
            await interaction.reply({ content: `${userToUnsubscribe} wasn't subscribed!`, allowedMentions: { parse: [] } })
        }
    },
};