const { createWriteStream } = require('fs');
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require('discord.js');

module.exports = async (client, int) => {
    const req = int.customId.split('_')[0];

    client.emit('ticketsLogs', req, int.guild, int.member.user);

    switch (req) {
        case 'ticketaç': {
            const selectMenu = new MessageSelectMenu();

            selectMenu.setCustomId('ticket31');
            selectMenu.setPlaceholder('Ticket için bir kategori seçin');
            selectMenu.addOptions([
                {
                    emoji: '🎟️',
                    label: 'Öneri',
                    description: 'Öneri',
                    value: 'ticket31'
                },
                {
                    emoji: '🎟️',
                    label: 'Şikayet',
                    description: 'şikayet',
                    value: 'ticket31_şikayet'
                },
                {
                    emoji: '🎟️',
                    label: 'Destek',
                    description: 'Destek',
                    value: 'ticket31_destek'
                },
            ]);
//bunları kendiniz ayarlayın
            const row = new MessageActionRow().addComponents(selectMenu);

            return int.reply({ content: 'Ticket kategorisi ne olacak?', components: [row], ephemeral: true });
        }

        case 'ticket31': {
            const reason = int.values[0].split('_')[1];

            const channel = int.guild.channels.cache.find(x => x.name === `ticket-${int.member.id}`);

            if (!channel) {
                await int.guild.channels.create(`ticket-${int.member.id}`, {
                    type: 'GUILD_TEXT',
                    topic: `Ticket tarafından oluşturuldu ${int.member.user.username}${reason ? ` (${reason})` : ''} ${new Date(Date.now()).toLocaleString()}`,
                    permissionOverwrites: [
                        {
                            id: int.guild.id,
                            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },
                        {
                            id: int.member.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },
                        {
                            id: client.user.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        }
                    ]
                });

                const channel = int.guild.channels.cache.find(x => x.name === `ticket-${int.member.id}`);

                const ticketEmbed = new MessageEmbed();

                ticketEmbed.setColor('GREEN');
                ticketEmbed.setAuthor(`Ticketiniz başarıyla oluşturuldu ${int.member.user.username}${reason ? ` (${reason})` : ''} ✅`);
                ticketEmbed.setDescription('\`\`\`diff\n- Mevcut Ticketiniz kapatmak için aşağıdaki tepkiye tıklayın!\`\`\`');

                const closeButton = new MessageButton();

                closeButton.setStyle('DANGER');
                closeButton.setLabel('Ticket Kapat');
                closeButton.setCustomId(`ticketkapat2_${int.member.id}`);

                const row = new MessageActionRow().addComponents(closeButton);

                await channel.send({ embeds: [ticketEmbed], components: [row] });

                return int.update({ content: `Ticket açık <@${int.member.id}> <#${channel.id}> ✅`, components: [], ephemeral: true });
            } else {
                return int.update({ content: `Zaten açık bir ticketiniz var <#${channel.id}> ❌`, components: [], ephemeral: true });
            }
        }

        case 'ticketkapat2': {
            const channel = int.guild.channels.cache.get(int.channelId);

            await channel.edit({
                permissionOverwrites: [
                    {
                        id: int.guild.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: int.customId.split('_')[1],
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: client.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    }
                ]
            });

            const ticketEmbed = new MessageEmbed();

            ticketEmbed.setColor('RED');
            ticketEmbed.setAuthor(`${int.member.user.username} Bu ticketi kapatmaya karar verdi ❌`);
            ticketEmbed.setDescription('\`\`\`diff\n- Ticketi kalıcı olarak silmek veya ticketi yeniden açmak için aşağıdaki butona tıklayın.\`\`\`');

            const reopenButton = new MessageButton();

            reopenButton.setStyle('SUCCESS');
            reopenButton.setLabel('Yeniden Aç');
            reopenButton.setCustomId(`yenidenticket_${int.customId.split('_')[1]}`);

            const saveButton = new MessageButton();

            saveButton.setStyle('SUCCESS');
            saveButton.setLabel('Kaydet');
            saveButton.setCustomId(`kayıt_${int.customId.split('_')[1]}`);

            const deleteButton = new MessageButton();

            deleteButton.setStyle('DANGER');
            deleteButton.setLabel('Kapat');
            deleteButton.setCustomId('kapat');

            const row = new MessageActionRow().addComponents(reopenButton, saveButton, deleteButton);

            return int.reply({ embeds: [ticketEmbed], components: [row] });
        }

        case 'yenidenticket': {
            const channel = int.guild.channels.cache.get(int.channelId);

            await channel.edit({
                permissionOverwrites: [
                    {
                        id: int.guild.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: int.customId.split('_')[1],
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: client.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    }
                ]
            });

            const ticketEmbed = new MessageEmbed();

            ticketEmbed.setColor('GREEN');
            ticketEmbed.setAuthor(`Ticket yeniden açıldı ✅`);
            ticketEmbed.setDescription('\`\`\`diff\n- Mevcut ticketi kapatmak için aşağıdaki tepkiye tıklayın!\`\`\`');

            const closeButton = new MessageButton();

            closeButton.setStyle('DANGER');
            closeButton.setLabel('Kapat');
            closeButton.setCustomId(`ticketkapat2_${int.customId.split('_')[1]}`);

            const row = new MessageActionRow().addComponents(closeButton);

            return int.reply({ embeds: [ticketEmbed], components: [row] });
        }

        case 'kapat': {
            const channel = int.guild.channels.cache.get(int.channelId);

            return channel.delete();
        }

        case 'kayıt': {
            const channel = int.guild.channels.cache.get(int.channelId);

            await channel.messages.fetch().then(async msg => {
                let messages = msg.filter(msg => msg.author.bot !== true).map(m => {
                    const date = new Date(m.createdTimestamp).toLocaleString();
                    const user = `${m.author.tag}${m.author.id === int.customId.split('_')[1] ? ' (ticket oluşturan)' : ''}`;

                    return `${date} - ${user} : ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`;
                }).reverse().join('\n');

                if (messages.length < 1) messages = 'Bu bilette mesaj yok';

                const ticketID = Date.now();

                const stream = await createWriteStream(`./data/${ticketID}.txt`);

                stream.once('open', () => {
                    stream.write(`Kullanıcı ticketi ${int.customId.split('_')[1]} (kanal #${channel.name})\n\n`);
                    stream.write(`${messages}\n\nLogs ${new Date(ticketID).toLocaleString()}`);

                    stream.end();
                });

                stream.on('finishsex', () => int.reply({ files: [`./data/${ticketID}.txt`] }));
            });
        }
    }
};