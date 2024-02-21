const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { EmbedBuilder } = require("discord.js");

exports.run = async (client, message, args) => {
    const helpEmbed = new EmbedBuilder()
        .setTitle('Yardım Menüsü')
        .setDescription(`Merhaba, ${message.author}! 🌟 Discord sunucumuzdaki yardım menüsüne hoş geldiniz. Aşağıdaki butonları kullanarak istediğiniz işlemi gerçekleştirebilirsiniz. Ban işlemi için "Banla" butonunu, diğer işlemler için ilgili butonları kullanabilirsiniz. Daha fazla yardıma ihtiyacınız varsa moderatörlere başvurmayı unutmayın! 🛠️\n\n- - - - - - - - - - - `)

    const backButton = new ButtonBuilder()
        .setCustomId('back_button')
        .setLabel('Geri')
        .setStyle(ButtonStyle.Secondary);

    const button1 = new ButtonBuilder()
        .setCustomId('command1_help')
        .setLabel('Commands')
        .setStyle(ButtonStyle.Primary);

    const button2 = new ButtonBuilder()
        .setCustomId('command2_help')
        .setLabel('Developer')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
        .addComponents(button1, button2);

    const helpMessage = await message.channel.send({ embeds: [helpEmbed], components: [row] });

    // Buton tıklamalarını filtreleme
    const filter = i => i.customId === 'command1_help' || i.customId === 'command2_help' || i.customId === 'back_button';

    const collector = helpMessage.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async interaction => {
        if (interaction.customId === 'command1_help') {
            const commandListEmbed = new EmbedBuilder()
                .setTitle('Komut Listesi')
                .setDescription('İşte mevcut komutlar:')
                .addFields(
                    { name: '.ban', value: 'Belirli bir üyeyi sunucudan yasaklar.' },
                    { name: '.ping', value: 'Botun gecikme süresini gösterir.' },
                    { name: '.sil', value: 'Belirli bir miktarda mesajı siler.' },
                    { name: '.unban', value: 'Bir üyenin sunucu yasağını kaldırır.' },
                    { name: '.yardım', value: 'Yardım menüsünü gösterir.' }
                );
    
            const updatedRow = new ActionRowBuilder()
                .addComponents(backButton);
    
            await interaction.update({ embeds: [commandListEmbed], components: [updatedRow] });
        } else if (interaction.customId === 'command2_help') {
            const guildOwner = await message.guild.members.fetch(message.guild.ownerId);
            const ownerAndBotInfoEmbed = new EmbedBuilder()
                .setTitle('Sunucu ve Bot Bilgisi')
                .setDescription('Sunucu sahibi ve bot bilgileri:')
                .addFields(
                    { name: 'Sunucu Sahibi', value: guildOwner.user.tag },
                    { name: 'Bot Sahibi', value: client.user.tag }
                );
    
            const updatedRow = new ActionRowBuilder()
                .addComponents(backButton);
    
            await interaction.update({ embeds: [ownerAndBotInfoEmbed], components: [updatedRow] });
        } else if (interaction.customId === 'back_button') {
            await interaction.update({ embeds: [helpEmbed], components: [row] });
        }
    });

    collector.on('end', collected => {
        // Toplama sona erdiğinde yapılacak işlemler
    });
};

exports.conf = {
    aliases: ['yardım']
};

exports.help = {
    name: 'yardım'
};
