const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
module.exports = {
    name: 'setup',

    execute(client, message) {
        let sahip = ["341592492224806914"]
        if (!sahip.some(x => x == message.author.id)) {
            return message.channel.send({ content: `botun sahibi kullanabilir` });
        }

        const setupEmbed = new MessageEmbed();

        setupEmbed.setColor('GREEN');
        setupEmbed.setAuthor({ name: 'Ticket Sistem'});
        setupEmbed.setDescription('Ticket açmak için aşağıda ki butona tıklayın');

        const ticketButton = new MessageButton();

        ticketButton.setStyle('SUCCESS');
        ticketButton.setLabel('Ticket Aç');
        ticketButton.setCustomId('ticketaç');

        const row = new MessageActionRow().addComponents(ticketButton);

        message.channel.send({ embeds: [setupEmbed], components: [row] });
    },
};