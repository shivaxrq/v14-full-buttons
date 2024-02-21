const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has("BAN_MEMBERS")) 
    return message.channel.send("Yetkiniz yetersiz kaldı, üyeleri yasakla yetkisine sahip olmanız gerekmekte.");
  
  const user = message.mentions.users.first();
  if (!user)
    return message.reply("Lütfen yasaklamak istediğiniz bir kullanıcıyı etiketleyin.");
  
  const reason = args.slice(1).join(" ");
  
  const banEmbed = new EmbedBuilder()
  .setColor('#ff0000')
  .setTitle('Kullanıcıyı Banla')
  .setDescription(`${user.tag} kullanıcısını banlamak istiyor musunuz?`)
  .addFields(
    { name: 'Sebep:', value: reason || "Neden belirtilmedi." }
  )
  .setTimestamp();


  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('confirm_ban')
        .setLabel('Ban')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('cancel_ban')
        .setLabel('İptal')
        .setStyle(ButtonStyle.Primary),
    );

  const sentMessage = await message.channel.send({ 
    embeds: [banEmbed],
    components: [row]
  });

  const filter = (interaction) => interaction.customId === 'confirm_ban' || interaction.customId === 'cancel_ban';
  const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 });

  collector.on('collect', async interaction => {
    if (interaction.customId === 'confirm_ban') {
      await message.guild.members.ban(user, { reason: reason || "Neden belirtilmedi." });
      interaction.reply({ content: 'Kullanıcı başarıyla banlandı.', ephemeral: true });
    } else if (interaction.customId === 'cancel_ban') {
      interaction.reply({ content: 'Ban işlemi iptal edildi.', ephemeral: true });
    }
  });

  collector.on('end', collected => {
    if (collected.size === 0) {
      message.channel.send('Zaman aşımı! İşlem iptal edildi.');
    }
  });
};

exports.conf = {
  aliases: ["yasakla"]
};

exports.help = {
  name: "ban"
};
