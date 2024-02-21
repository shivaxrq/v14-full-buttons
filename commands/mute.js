const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const info = require("../config");

exports.run = async (client, message, args) => {
    // Komutu kullanıcıya sadece belirli bir rol atama izni olanlar kullanabilir
    if (!message.member.permissions.has("MANAGE_ROLES")) 
        return message.channel.send("Yetkiniz yetersiz kaldı, rolleri yönet yetkisine sahip olmanız gerekmekte.");

    // Kullanıcıyı belirleme
    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target)
        return message.channel.send("Kullanıcı bulunamadı. Lütfen bir kullanıcı etiketleyin veya ID'sini girin.");

    // Mute sürelerini içeren menü seçenekleri
    const muteOptions = [
        { 
            label: "Kışkırtma, Trol ve Dalgacı Davranış",
            value: "mute1",
            description: "5 Dakika",
            
        },
        { 
            label: "Flood Spam ve Capslock Kullanımı",
            value: "mute2",
            description: "10 Dakika",
            
        },
        // Diğer mute seçenekleri buraya eklenebilir...
        { 
            label: "Menü Kapatmak",
            value: "mute8",
            description: "İptal Menüsü",
        }
    ];

    // Susturulacak üyeyi seçmek için bir menü oluşturuyoruz
    const muteMenu = new StringSelectMenuBuilder()
        .setCustomId('muteSelect')
        .setPlaceholder('Bir seçenek seçin')
        .addOptions(muteOptions);

    // ActionRowBuilder ile menüyü içeren bir action row oluşturuyoruz
    const row = new ActionRowBuilder()
        .addComponents(muteMenu);

    // Mesajı gönderirken bu menüyü içeren bir action row ekliyoruz
    const msg = await message.channel.send({ content: "Susturma sebebini seçin:", components: [row] });

    // Menü seçimlerini dinlemek için bir collector oluşturuyoruz
    const filter = i => i.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter }); // Zaman sınırlaması olmadan

    // Menü seçimlerini dinleyen fonksiyon
    collector.on('collect', async interaction => {
        try {
            // Seçilen menü değerini alıyoruz
            const selectedOption = interaction.values[0];

            if (selectedOption === 'mute8') {
                // Kapatma seçeneği ise menüyü kapatıyoruz
                await interaction.deferUpdate();
                collector.stop('kapat');
                msg.edit({ components: [] });
                return;
            }

            // Mute süresine göre rolü alıyoruz
            const muteRole = message.guild.roles.cache.get(info.Genel.susturmaRol);
            if (!muteRole) return message.channel.send("Susturma rolü bulunamadı!");

            await interaction.deferUpdate(); // Menü seçimini Discord'a bildiriyoruz

            // Seçilen süreye göre mute işlemi
            switch (selectedOption) {
                case 'mute1':
                    await target.roles.add(muteRole);
                    setTimeout(() => {
                        target.roles.remove(muteRole);
                    }, 300000); // 5 dakika
                    break;
                case 'mute2':
                    await target.roles.add(muteRole);
                    setTimeout(() => {
                        target.roles.remove(muteRole);
                    }, 600000); // 10 dakika
                    break;
                // Diğer mute sürelerini buraya ekleyebilirsiniz...
            }
            
            // Başarılı bir şekilde susturulduğunu belirten mesaj gönderme
            message.channel.send(`${target} başarıyla susturuldu.`);
        } catch (error) {
            console.error("Bir hata oluştu:", error);
            message.channel.send("Susturma işlemi sırasında bir hata oluştu!");
        }
    });
};

exports.conf = {
    aliases: ["sustur"]
};

exports.help = {
    name: "sustur"
};
