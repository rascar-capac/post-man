const { SlashCommandBuilder } = require('discord.js');
const openurl = require('openurl2');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mail')
        .setDescription('Démarre un mail depuis votre boîte aux membres abonnés aux mails et appartenant au rôle spécifié')
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('Le rôle dont les membres (abonnés aux mails) recevront ce mail')
                .setRequired(true)
            ),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        let subscribersString = '';
        const recipients = [];
        for (const member of role.members.values()) {
            const email = interaction.client.subscribers.get(member.user);
            if (email != undefined) {
                recipients.push(email);
                subscribersString += `${member}\n`;
            }
        }

        if (recipients.length > 0) {
            const fields = {};
            const subject = interaction.options.getString('object');
            if (subject)
            {
                fields.subject = subject;
            }
            const body = interaction.options.getString('content');
            if (body)
            {
                fields.body = body;
            }
            openurl.mailto([recipients], fields);
            await interaction.reply({ content: `Mail envoyé aux membres abonnés du rôle ${role} :\n${subscribersString}`, allowedMentions: { parse: [] } });
        }
        else {
            await interaction.reply({ content: `Aucun membre abonné dans le rôle ${role}…`, allowedMentions: { parse: [] } });
        }
    },
};
