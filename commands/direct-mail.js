const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const nodemailer = require('nodemailer');
const { customHost, customPort, customUser, customPassword } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('directmail')
        .setDescription('Sends an email with the configured address to the subscribed users')
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('The role whose members (subscribed to PostMan) will receive this email')
                .setRequired(true)
            ),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('newEmail')
            .setTitle('New email');
        const objectInput = new TextInputBuilder()
            .setCustomId('object')
            .setLabel('Object of the email')
            .setPlaceholder('Add an object here…')
            .setStyle(TextInputStyle.Short);
        const contentInput = new TextInputBuilder()
            .setCustomId('content')
            .setLabel('Body of the email')
            .setPlaceholder('and write your message here!')
            .setStyle(TextInputStyle.Paragraph);
        const objectActionRow = new ActionRowBuilder().addComponents(objectInput);
        const contentActionRow = new ActionRowBuilder().addComponents(contentInput);
        modal.addComponents(
            objectActionRow,
            contentActionRow
            );

        interaction.client.modalSubmits.set(modal.data.custom_id, async modalInteraction => {
            const role = interaction.options.getRole('role');
            let subscribersString = '';
            const recipients = [];
            for (const member of role.members.values()) {
                const email = modalInteraction.client.subscribers.get(member.user);
                if (email != undefined) {
                    recipients.push(email);
                    subscribersString += `${member}\n`;
                }
            }

            if (recipients.length > 0) {
                const subject = modalInteraction.fields.getTextInputValue('object');
                const body = modalInteraction.fields.getTextInputValue('content');
                const transporter = nodemailer.createTransport({
                    host: customHost,
                    port: customPort,
                    secure: false,
                    auth: {
                        user: customUser,
                        pass: customPassword
                    },
                    tls: { rejectUnauthorized: false }
                });
                const mailOptions = {
                    from: customUser,
                    to: recipients,
                    subject: subject,
                    text: body
                };

                transporter.sendMail(mailOptions, async error => {
                    if (error) {
                        await modalInteraction.reply({ content: 'An error has occured while the email was being sent !'});
                        console.log(error);
                    } else {
                        await modalInteraction.reply({ content: `Email sent to subscribers in ${role} :\n${subscribersString}`, allowedMentions: { parse: [] } });
                    }
                });
            }
            else {
                await modalInteraction.reply({ content: `No user is subscribed in ${role}…`, allowedMentions: { parse: [] } });
            }
        });

        await interaction.showModal(modal);
    },
};
