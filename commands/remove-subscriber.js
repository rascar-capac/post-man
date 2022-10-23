const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('désabonner')
        .setDescription('Désabonne un membre aux mails envoyés par le bot')
        .addUserOption(option =>
            option
                .setName('utilisateur')
                .setDescription('L’utilisateur que vous voulez désabonner')
                .setRequired(true)),
    async execute(interaction) {
        const userToUnsubscribe = interaction.options.getUser('utilisateur');
        if (interaction.client.subscribers.delete(userToUnsubscribe)) {
            await interaction.reply(`L’adresse email de l’utilisateur ${userToUnsubscribe} n’est plus abonnée aux mails !`);
        }
        else {
            await interaction.reply({ content: `L’utilisateur ${userToUnsubscribe} n’était pas abonné !`, allowedMentions: { parse: [] } })
        }
    },
};