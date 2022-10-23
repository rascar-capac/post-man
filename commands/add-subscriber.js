const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('abonner')
        .setDescription('Abonne un membre aux mails envoyés par le bot')
        .addUserOption(option =>
            option
                .setName('utilisateur')
                .setDescription('L’utilisateur que vous voulez abonner')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('adresse-email')
                .setDescription('L’adresse email de l’utilisateur')
                .setRequired(true)),
    async execute(interaction) {
        const newUser = interaction.options.getUser('utilisateur');
        interaction.client.subscribers.set(newUser, interaction.options.getString('adresse-email'));
        await interaction.reply(`L’adresse email de l’utilisateur ${newUser} est maintenant abonnée aux mails !`);
    },
};