module.exports = (client, type, guild, user) => {
    switch (type) {
        case 'ticketaç': {
            return console.log(`${user.username} az önce sunucuda bir bilet oluşturdu ${guild.name}`);
        }

        case 'ticketkapat2': {
            return console.log(`${user.username} az önce sunucuda bir bilet kapattı ${guild.name}`);
        }

        case 'yenidenticket': {
            return console.log(`${user.username} az önce sunucuda bir bilet yeniden açıldı ${guild.name}`);
        }

        case 'kapat': {
            return console.log(`${user.username} az önce sunucudaki bir bileti sildim ${guild.name}`);
        }

        case 'kayıt': {
            return console.log(`${user.username} az önce sunucuya bir bilet kaydetti ${guild.name}`);
        }
    }
};