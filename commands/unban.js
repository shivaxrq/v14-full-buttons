const { ButtonStyle } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has("BAN_MEMBERS")) 
        return message.channel.send("Yetkiniz yetersiz kaldı, üyeleri yasak kaldırma yetkisine sahip olmanız gerekmekte.");
    
    const userID = args[0];
    if (!userID || isNaN(userID)) 
        return message.reply("Lütfen yasağı kaldırmak istediğiniz kullanıcının ID'sini belirtin.");
    
    try {
        const bannedUsers = await message.guild.bans.fetch();
        const bannedUser = bannedUsers.find(user => user.user.id === userID);
        if (!bannedUser)
            return message.reply("Belirtilen ID'ye sahip bir yasak bulunamadı.");

        const embed = new EmbedBuilder()
            .setColor("#00ff00")
            .setTitle("Kullanıcı Yasak Kaldırma İşlemi")
            .setDescription(`Aşağıdaki butonlardan birine basarak ${bannedUser.user.tag} kullanıcısının yasağını kaldırabilirsiniz.`)
            .addFields(
                { name: "Kullanıcı ID", value: bannedUser.user.id },
                { name: "Kullanıcı Adı", value: bannedUser.user.tag }
            )
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('unban_yes')
                    .setLabel('Yasağı Kaldır')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('unban_no')
                    .setLabel('İptal')
                    .setStyle(ButtonStyle.Danger)
            );

        const reply = await message.channel.send({ embeds: [embed], components: [row] });

        const filter = i => i.user.id === message.author.id;
        const collector = reply.createMessageComponentCollector({ filter, time: 15000 }); // 15 saniye içinde yanıt alınmazsa iptal et

        collector.on('collect', async interaction => {
            if (interaction.customId === 'unban_yes') {
                // Kaldır düğmesine basıldığında yapılacak işlem
                try {
                    await message.guild.members.unban(userID);
                    await interaction.update({ content: 'Kullanıcının yasağı kaldırıldı.', components: [] });
                } catch (error) {
                    console.error("Bir hata oluştu:", error);
                    await interaction.update({ content: 'Yasağı kaldırma işlemi başarısız oldu. Lütfen konsolu kontrol edin.', components: [] });
                }
            } else if (interaction.customId === 'unban_no') {
                // İptal düğmesine basıldığında yapılacak işlem
                await interaction.update({ content: 'Yasağı kaldırma işlemi iptal edildi.', components: [] });
            }
        });

        collector.on('end', () => {
            reply.edit({ components: [] }); // Seçenekler otomatik olarak kaldırıldığında
        });
    } catch (err) {
        console.error("Bir hata oluştu:", err);
        message.reply("Bir hata oluştu! Lütfen konsolu kontrol edin.");
    }
};

exports.conf = {
    aliases: ["unban"]
};

exports.help = {
    name: "unban"
};