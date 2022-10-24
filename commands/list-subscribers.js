const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listsubscribers')
        .setDescription('Lists all the users subscribed to the emails sent by PostMan'),
    async execute(interaction) {
        let subscribersString = '';
        if (interaction.client.subscribers.size > 0) {
            const subscribers = interaction.client.subscribers.keys();
            for (const subscriber of subscribers) {
                subscribersString += `${subscriber}\n`;
            }
            await interaction.reply({content: `Subscribed users:\n${subscribersString}`, ephemeral: true, allowedMentions: { parse: [] } });
        }
        else {
            await interaction.reply({ content: 'There isn\'t any subscribed user!', ephemeral: true});
        }
    },
};