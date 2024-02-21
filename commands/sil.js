const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send("Yetkiniz yetersiz kaldı, mesajları yönet yetkisine sahip olmanız gerekmekte.");

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('silButton25')
                .setLabel('25')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('silButton40')
                .setLabel('40')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('silButton60')
                .setLabel('60')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('silButton100')
                .setLabel('100')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('silButtonCancel')
                .setLabel('İptal')
                .setStyle(ButtonStyle.Danger)
        );

    const msg = await message.channel.send({ content: "Kaç mesaj silmek istiyorsunuz?", components: [row] });

    const filter = i => i.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async interaction => {
        if (interaction.customId.startsWith('silButton')) {
            const bgmiktar = parseInt(interaction.customId.replace('silButton', ''));
            if (isNaN(bgmiktar) || bgmiktar < 1) return;

            await interaction.deferUpdate();
            await message.channel.bulkDelete(bgmiktar, true)
                .then(() => {
                    message.channel.send(`Başarıyla ${bgmiktar} miktar mesaj silindi.`);
                })
                .catch(error => {
                    console.error('Hata:', error);
                    message.channel.send('Beklenmedik bir hata oluştu!');
                });
        } else if (interaction.customId === 'silButtonCancel') {
            await interaction.deferUpdate();
            collector.stop('iptal');
            message.channel.send('İşlem iptal edildi.');
            msg.edit({ components: [] });
        }
    });

    collector.on('end', collected => {
        if (!collected.size) {
            message.channel.send('Komut zaman aşımına uğradı. İşlem iptal edildi.');
            msg.edit({ components: [] });
        } else if (collected.has('iptal')) {
            message.channel.send('İşlem iptal edildi.');
            msg.edit({ components: [] });
        }
    });
};

exports.conf = {
    aliases: ["temizle"]
};

exports.help = {
    name: "sil"
};
