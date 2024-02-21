const client = require("../shiva.js");
const { Collection } = require("discord.js")
const fs = require("fs")
const config = require("../config.js")
client.on("ready", () => {

client.user.setActivity(config.Bot.BotDurum)
client.user.setStatus(config.Bot.DurumTipi)
client.commands = new Collection();
client.aliases = new Collection();

fs.readdir("./commands/", (err, files) => {
if (err) console.error(err);
console.log(`[shiva-KOMUT] ${files.length} adet komut yükleme işlemine koyuldu.`);
files.forEach(f => {
let props = require(`../commands/${f}`);
    
console.log(`[shiva-KOMUT] ${props.help.name} isimli komut yüklendi.`);

    
client.commands.set(props.help.name, props);
props.conf.aliases.forEach(alias => {
client.aliases.set(alias, props.help.name);
console.log(`[shivaa-BOT] ${client.user.tag} ismiyle Discord APİ bağlantısı kuruldu!`)
});
});
});

});
