const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const info = require("../config");
const config = require('../config');

exports.run = async (client, message, args) => {
    // Komutu kullanıcıya sadece belirli bir rol atama izni olanlar kullanabilir
    if (!message.member.permissions.has("MANAGE_ROLES")) 
        return message.channel.send("Yetkiniz yetersiz kaldı, rolleri yönet yetkisine sahip olmanız gerekmekte.");

    // ActionRowBuilder ile butonları içeren action row'ları oluşturuyoruz
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('etkinlikKatilButton')
                .setLabel('Etkinlik Katılımcısı')
                .setEmoji('🎁')
                .setStyle(ButtonStyle.Primary), // Etkinlik katılımcısı butonu
            new ButtonBuilder()
                .setCustomId('cekilisKatilButton')
                .setLabel('Çekiliş Katılımcısı')
                .setEmoji('🎉')
                .setStyle(ButtonStyle.Primary) // Çekiliş katılımcısı butonu
        );

    // Mesajı gönderirken bu butonları içeren bir action row ekliyoruz
    const msg = await message.channel.send({ content: `Herkese merhaba **${message.guild.name}** Ailesi Bildiğiniz üzere sunucumuzda birçok **Çekiliş**,**Konser**,**Etkinlik**,**Oyun** günleri düzenlenicektir.
    \n*__everyone__*,*__here__* gibi topluluğu rahatsız edicek etiketleri atmayacağız **Etkinlik** ve **Çekilişlerden** Haberdar olmak için asaşğıda ki butonlardan ilgili rolü alabilirsiniz.
    \n**▪︎** **Oyun** & **Etkinlik** günlerinden haberdar olmak için **ETKİNLİK KATILIMCISI** Rolünü alabilirsiniz.
    \n**▪︎** **Konser** & **Çekiliş** günlerinden haberdar olmak için **ÇEKİLİŞ KATILIMCISI** Rolünü alabilirsiniz.
    `, components: [row] });

    // Buton tıklamalarını dinlemek için bir collector oluşturuyoruz
    const filter = i => i.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter }); // Zaman sınırlaması olmadan

    // Buton tıklamalarını dinleyen fonksiyon
    collector.on('collect', async interaction => {
        try {
            let roleId;
            let roleName;

            // Hangi butona basıldığını kontrol ediyoruz
            if (interaction.customId === 'etkinlikKatilButton') {
                roleId = info.Genel.katılım.roleetkinkatılım;
                roleName = 'Etkinlik Katılımcısı';
            } else if (interaction.customId === 'cekilisKatilButton') {
                roleId = info.Genel.katılım.roleçekilkatılım;
                roleName = 'Çekiliş Katılımcısı';
            } else {
                return; // Tanımlı olmayan bir buton tıklandığında hiçbir şey yapma
            }

            // Rolü alacak işlem burada gerçekleştirilir
            const role = message.guild.roles.cache.get(roleId);
            if (!role) return message.channel.send("Rol bulunamadı!");

            await interaction.deferUpdate(); // Butonun tıklanıldığını Discord'a bildiriyoruz

            // Kullanıcıya rolü verme işlemi
            await interaction.member.roles.add(role);
            
            // Başarılı bir şekilde rol verildiğini belirten mesaj gönderme
            message.channel.send(`Başarıyla ${roleName} rolü alındı: ${role.name}`);
        } catch (error) {
            console.error("Bir hata oluştu:", error);
            message.channel.send("Rol alma işlemi sırasında bir hata oluştu!");
        }
    });

    // Collector'ın sonlandırılması gerekmez
};

exports.conf = {
    aliases: ["katil"]
};

exports.help = {
    name: "katil"
};
