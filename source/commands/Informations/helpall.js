const Discord = require('discord.js');

module.exports = {
    name: "helpall",
    description: "Permet de voir la liste des commandes triées par permission",
    
    run: async (client, message, args, commandName) => {
        const color = client.color;
        const footer = client.footer;
        let pass = false 
        let staff = client.staff
        if(!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true){
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true; 
            if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = true;   
          } else pass = true;
            if (pass === false) {
    if (client.noperm && client.noperm.trim() !== '') {
        return message.channel.send(client.noperm);
    } else {
        return; 
    }
}    
        
        let perm_public = [];
        let perm_1 = [];
        let perm_2 = [];
        let perm_3 = [];
        let perm_4 = [];
        let perm_5 = [];

        client.commands.forEach((m) => {
            let perm = client.db.get(`perm_${m.name}.${message.guild.id}`);
            if (perm === "public") perm_public.push(m.name);
            else if (perm === "1") perm_1.push(m.name);
            else if (perm === "2") perm_2.push(m.name);
            else if (perm === "3") perm_3.push(m.name);
            else if (perm === "4") perm_4.push(m.name);
            else if (perm === "5") perm_5.push(m.name);
        });

       async function getMessageContent(page) {
            let commands;
            let permission;

            switch (page) {
                case 0:
                    commands = perm_public;
                    permission = "Permission Publique";
                    break;
                case 1:
                    commands = perm_1;
                    permission = "Permission 1";
                    break;
                case 2:
                    commands = perm_2;
                    permission = "Permission 2";
                    break;
                case 3:
                    commands = perm_3;
                    permission = "Permission 3";
                    break;
                case 4:
                    commands = perm_4;
                    permission = "Permission 4";
                    break;
                case 5:
                    commands = perm_5;
                    permission = "Permission 5";
                    break;
                default:
                    commands = [];
                    permission = "Inconnu";
                    break;
            }

            return new Discord.EmbedBuilder()
                .setTitle(permission)
                .setColor(color)
                .setFooter(footer)
                .setDescription(`\`\`\`yml\n${commands.length > 0 ? commands.map((cmdn, index) => `${index + 1}. ${cmdn}`).join("\n") : await client.lang('helpall.nocmd')}\`\`\``);
            }

        let currentPage = 0;
        let messageContent = await getMessageContent(currentPage);

        let prevButton = new Discord.ButtonBuilder()
            .setCustomId('prev_button'+ message.id )
            .setLabel('<<<')
            .setDisabled(currentPage === 0)
            .setStyle(Discord.ButtonStyle.Primary)

        let nextButton = new Discord.ButtonBuilder()
            .setCustomId('next_button' + message.id)
            .setLabel('>>>')
            .setStyle(Discord.ButtonStyle.Primary);

        let row = new Discord.ActionRowBuilder()
            .addComponents(prevButton, nextButton);
    
        let helpMessage = await message.channel.send({ embeds: [messageContent], components: [row] });

        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'prev_button' + message.id) {
                if (currentPage > 0) {
                    currentPage--;
                    messageContent = await getMessageContent(currentPage);
                    await interaction.update({ embeds: [messageContent], components: [getRow(currentPage)] });
                }
            } else if (interaction.customId === 'next_button' + message.id) {
                if (currentPage < 5) {
                    currentPage++;
                    messageContent = await getMessageContent(currentPage);
                    await interaction.update({ embeds: [messageContent], components: [getRow(currentPage)] });
                }
            }
        });

        collector.on('end', () => {
            helpMessage.edit({ components: [] });
        });

        function getRow(currentPage) {
            const prevButton = new Discord.ButtonBuilder()
                .setCustomId('prev_button' + message.id)
                .setLabel('<<<')
                .setStyle(Discord.ButtonStyle.Primary)
                .setDisabled(currentPage === 0);

            const nextButton = new Discord.ButtonBuilder()
                .setCustomId('next_button' + message.id)
                .setLabel('>>>')
                .setStyle(Discord.ButtonStyle.Primary)
                .setDisabled(currentPage === 5); 

            return new Discord.ActionRowBuilder()
                .addComponents(prevButton, nextButton);
        }
    
    }
};

