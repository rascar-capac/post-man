const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listerabonnés')
        .setDescription('Liste tous les membres abonnés aux mails envoyés par le bot'),
    async execute(interaction) {
        let subscribersString = '';
        if (interaction.client.subscribers.size > 0) {
            const subscribers = interaction.client.subscribers.keys();
            for (const subscriber of subscribers) {
                subscribersString += `${subscriber}\n`;
            }
            await interaction.reply({content: `Abonnés :\n${subscribersString}`, ephemeral: true, allowedMentions: { parse: [] } });
        }
        else {
            await interaction.reply({ content: 'Aucun membre n’est abonné !', ephemeral: true});
        }
    },
};