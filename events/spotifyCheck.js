const { Events } = require('discord.js');

module.exports = {
    name: Events.PresenceUpdate,
    async execute(oldPresence, newPresence) {
        console.log('PresenceUpdate event triggered');
        try {
            const user = newPresence.user;
            const statusMessage = `${user.tag} updated their presence: ${newPresence.status}`;
            console.log(statusMessage);
        } catch (error) {
            console.error('Error in PresenceUpdate event handler:', error);
        }
    }
};
