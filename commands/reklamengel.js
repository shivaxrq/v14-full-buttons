const { ActionRowBuilder, ButtonBuilder, ButtonStyle, CollectorFilter } = require('discord.js');

exports.run = async (client, message, args) => {
    // Yetki kontrolü yapılabilir (örneğin, sadece yöneticilere izin vermek isteyebilirsiniz)
    if (!message.member.permissions.has("MANAGE_MESSAGES")) {
        return message.channel.send("Yetkiniz yetersiz kaldı, mesajları yönet yetkisine sahip olmanız gerekmekte.");
    }

    // Başlangıçta reklam engelinin kapalı olduğunu varsayalım
    let reklamEngeliAktif = false;

    // Reklam engel butonu
    const reklamEngelButon = new ButtonBuilder()
        .setCustomId('reklamEngel')
        .setLabel('Reklam Engeli')
        .setStyle(reklamEngeliAktif ? ButtonStyle.Success : ButtonStyle.Danger);

    // Butonları içeren action row
    const row = new ActionRowBuilder().addComponents(reklamEngelButon);

    // Komutu gönderirken butonları ekleyin
    const msg = await message.channel.send({ content: 'Reklam engellemeyi etkinleştirmek için butona tıklayın:', components: [row] });

    // Buton tıklamalarını dinleyen olay
    const filter = i => i.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async interaction => {
        if (interaction.customId === 'reklamEngel') {
            // Reklam engeli durumunu tersine çevir
            reklamEngeliAktif = !reklamEngeliAktif;

            // Butonun rengini güncelle (duruma göre yeşil veya kırmızı)
            reklamEngelButon.setStyle(reklamEngeliAktif ? ButtonStyle.Success : ButtonStyle.Danger);

            // Butonu güncelle
            await interaction.update({ components: [new ActionRowBuilder().addComponents(reklamEngelButon)] });

            // Reklam engeli açıldığında veya kapatıldığında bildirim gönder
            await interaction.reply({ content: `Reklam engelleyici ${reklamEngeliAktif ? 'aktif' : 'kapalı'} hale getirildi.`, ephemeral: true });
        }
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
            message.channel.send('Komut zaman aşımına uğradı. İşlem iptal edildi.');
        }
    });
};

exports.conf = {
    aliases: [],
    permissions: ['MANAGE_MESSAGES'], // Reklam engeli etkinleştirmek için gereken izinler
    guildOnly: true,
};

exports.help = {
    name: 'reklam-engel',
    description: 'Reklam engelini etkinleştirmek için butonlu bir sistem.',
    usage: 'reklam-engel',
};
