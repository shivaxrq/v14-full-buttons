const guildMemberUpdate = require('./guildMemberUpdate.js');

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    guildMemberUpdate(client, oldMember, newMember);
});
