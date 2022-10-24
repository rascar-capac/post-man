const { SlashCommandBuilder } = require('discord.js');
const openurl = require('openurl2');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mail')
        .setDescription('Starts an email from your mailbox to the users subscribed to PostMan and in the specified role')
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('The role whose members (subscribed to PostMan) will receive this email')
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
            await interaction.reply({ content: `Email sent to subscribers in ${role} :\n${subscribersString}`, allowedMentions: { parse: [] } });
        }
        else {
            await interaction.reply({ content: `No user is subscribed in ${role}…`, allowedMentions: { parse: [] } });
        }
    },
};
