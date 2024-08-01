require("dotenv/config");

const { ActivityType, Client, Events } = require("discord.js");
const colors = require("colors");
const { actualisationJoueursStatusEnMinute, Status } = require("../config.json");

const statusWherePlayers = async (client) => {
    const [status, players] = await client.Utils.fetchPlayers(Status.ip, Status.port);
    
    if (status && status >= 200 && status < 300 && status < 400 && status < 500) {
        client.user.setPresence({
            activities: [{ name: `${players.length} joueur${players.length > 1 ? "s" : ""}`, type: ActivityType.Watching }],
            status: ActivityType.Watching
        });
    } else {
        client.user.setPresence({
            activities: [{ name: "Hors ligne", type: ActivityType.Watching }],
            status: ActivityType.Watching
        });
    }
}

module.exports = {
    name: Events.ClientReady,
    description: "Evenement lorsque le bot est chargée.",

    /** 
     * @param {Client} client 
    */
    async execute(client) {
        const guild = await client.guilds.cache.get(process.env.APP_GUILD_ID);
        
        if (Status && Status.active === true) {
            statusWherePlayers(client);
            
            if (process.env.MODE === "production") {
                if (typeof actualisationJoueursStatusEnMinute === "number") {
                    setInterval(() => {
                        statusWherePlayers(client);
                    }, actualisationJoueursStatusEnMinute * 60000);
    
                    console.log(`Actualisation des joueurs toutes les ${actualisationJoueursStatusEnMinute} minutes`);
                }
            }
        }

        console.log(colors.green(`${client.user.username} is ready to use to ${guild.name} avec ${guild.memberCount} membres!`));
    }
}