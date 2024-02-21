const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

exports.run = async (client, message, args) => {
    // Butonları içeren action row'ları oluştur
    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('I')
                .setLabel('1️⃣')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('II')
                .setLabel('2️⃣')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('III')
                .setLabel('3️⃣')
                .setStyle(ButtonStyle.Primary)
        );

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('IV')
                .setLabel('4️⃣')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('V')
                .setLabel('5️⃣')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('VI')
                .setLabel('6️⃣')
                .setStyle(ButtonStyle.Primary)
        );

    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('VII')
                .setLabel('7️⃣')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('VIII')
                .setLabel('8️⃣')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('IX')
                .setLabel('9️⃣')
                .setStyle(ButtonStyle.Primary)
        );

    // Mesajı gönderirken butonları ekle
    const msg = await message.channel.send({ content:`Merhaba \`${message.guild.name}\` sunucusu içerisi yapmak istediğiniz işlem veya ulaşmak istediğiniz bilgi için gerekli butonlara tıklamanız yeterli olucaktır!\n\n**1:** \`Sunucuya giriş tarihinizi öğrenin.\`\n**2:** \`Üstünüzde bulunan rollerin listesini alın.\`\n**3:** \`Hesabınızın açılış tarihini öğrenin.\`\n\n**4:** \`Davet bilgilerinizi öğrenin.\`\n**5:** \`Tekrardan sesli kayıt olun.\`\n**6:** \`Sunucunun anlık aktif listesini görüntüleyin.\`\n\n**7:** \`Sunucudaki eski isim bilgilerinizi görüntüleyin.\`\n**8:** \`Sunucudaki toplam mesaj sayınızı öğrenin.\`\n**9:** \`Sunucu ses kanallarında toplam geçirdiğiniz süreyi öğrenin.\`\n`, components: [row1, row2, row3] });

    // Buton tıklamalarını dinleyen olay
    const filter = i => i.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async interaction => {
        let content;
        switch (interaction.customId) {
            case 'I':
                content = getServerInfo1(interaction.guild);
                break;
            case 'II':
                content = getServerInfo2(interaction.guild);
                break;
            case 'III':
                content = getServerInfo3(interaction.guild);
                break;
            case 'IV':
                content = getServerInfo4(interaction.guild);
                break;
            case 'V':
                content = getServerInfo5(interaction.guild);
                break;
            case 'VI':
                content = getServerInfo6(interaction.guild);
                break;
            case 'VII':
                content = getServerInfo7(interaction.guild);
                break;
            case 'VIII':
                content = getServerInfo8(interaction.guild);
                break;
            case 'IX':
                content = getServerInfo9(interaction.guild);
                break;
            default:
                content = 'Geçersiz seçenek.';
        }

        // Mesajı gönder
        await interaction.reply({ content, ephemeral: true });
    });

    collector.on('end', () => {
        // Zaman aşımı durumunda mesajı güncelle ve işlemi iptal et
        msg.edit({ content: 'Zaman aşımına uğradı. İşlem iptal edildi.', components: [] });
    });
};

// Sunucu bilgilerini almak için fonksiyonlar
function getServerInfo1(guild) {
    return `Sunucunun adı: ${guild.name}`;
}

function getServerInfo2(guild) {
    if (guild.owner) {
        return `Sunucunun sahibi: ${guild.owner.user ? guild.owner.user.tag : 'Bilinmiyor'}`;
    } else {
        return 'Sunucu sahibi bulunamadı.';
    }
}

function getServerInfo3(guild) {
    return `Sunucunun bölgesi: ${guild.region}`;
}

function getServerInfo4(guild) {
    return `Sunucunun kuruluş tarihi: ${guild.createdAt.toDateString()}`;
}

function getServerInfo5(guild) {
    return `Sunucudaki üye sayısı: ${guild.memberCount}`;
}

function getServerInfo6(guild) {
    return `Sunucunun boost seviyesi: ${guild.premiumTier}`;
}

function getServerInfo7(guild) {
    return `Sunucuda kaç kişinin boost yaptığı: ${guild.premiumSubscriptionCount}`;
}

function getServerInfo8(guild) {
    return `Sunucudaki kanal sayısı: ${guild.channels.cache.size}`;
}

function getServerInfo9(guild) {
    return `Sunucunun ID'si: ${guild.id}`;
}


// Diğer sunucu bilgisi fonksiyonları da benzer şekilde eklenebilir

exports.conf = {
    aliases: [],
    guildOnly: true,
};

exports.help = {
    name: 'buton-komutu',
    description: 'Butonlarla sunucu hakkında bilgileri gösteren bir komut.',
    usage: 'buton-komutu',
};
