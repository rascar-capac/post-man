const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const nodemailer = require('nodemailer');
const { dpedrHost, dpedrPort, dpedrUser, dpedrPassword } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('maildpedr')
        .setDescription('Envoie un mail DPEDR aux membres abonnés aux mails et appartenant au rôle spécifié')
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('Le rôle dont les membres (abonnés aux mails) recevront ce mail')
                .setRequired(true)
            ),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('newMail')
            .setTitle('Nouveau mail');
        const objectInput = new TextInputBuilder()
            .setCustomId('object')
            .setLabel('Objet du mail')
            .setPlaceholder('Ajouter un objet ici…')
            .setStyle(TextInputStyle.Short);
        const contentInput = new TextInputBuilder()
            .setCustomId('content')
            .setLabel('Contenu du mail')
            .setPlaceholder('et rédigez votre message ici !')
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
                        await modalInteraction.reply({ content: 'Une erreur est survenue durant l’envoi du mail !'});
                        console.log(error);
                    } else {
                        await modalInteraction.reply({ content: `Mail envoyé aux membres abonnés du rôle ${role} :\n${subscribersString}`, allowedMentions: { parse: [] } });
                    }
                });
            }
            else {
                await modalInteraction.reply({ content: `Aucun membre abonné dans le rôle ${role}…`, allowedMentions: { parse: [] } });
            }
        });

        await interaction.showModal(modal);
    },
};
