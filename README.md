# PostMan

This is a simple discord bot that allows to send emails with a command to a subscribed list of users. Those users are members of your server. You can add users to a mailing list by linking an email address to a specified user. This user will then receive all the emails sent from this server.

You can either send an email from your personal address (via your default mail client), or directly from discord thanks to some SMTP credentials specified in a configuration file. This allows you to quickly send emails from a general address.

When sending an email, you can filter the recipients by selecting a role. Only the subscribed users from this role will receive that email.

PostMan adds 5 commands on your server:

- `subscribe`: subscribes a user to the emails sent by PostMan
- `unsubscribe`: unsubscribes a user from those emails
- `listsubscribers`: lists all the users subscribed to those emails
- `mail`: starts an email from your mailbox to the subscribed users. This will redirect you to your default mail client application, with the recipients already specified. It takes a role as parameter, to narrow down the recipients.
- `directmail`: directly sends an email with the configured address to the subscribed users. It takes a role as parameter, to narrow down the recipients.

## Installation

You'll have to create yourself a new discord application, clone this on a server with npm and add a `config.json` file to specify your discord credentials, as well as the SMTP credentials for the direct email feature. Here is the blank file:

```json
{
    "clientId": "XXX",
    "guildId": "XXX",
    "token": "XXX",
    "directHost": "XXX",
    "directPort": XXX,
    "directUser": "XXX",
    "directPassword": "XXX"
}
```

Then you'll have to execute `node deploy-commands.js` and then `node .`.

## Known issues

- Protonmail users have to use the paid version of Bridge to be able to send a direct email from their address. See <https://dev.to/polluterofminds/how-to-use-protonmail-with-nodemailer-5c4l>.
