module.exports = {
    name: 'messageCreate',
    run: async (client, message) => {
        if (!message.guild || message.author.bot) return;
        
        const args = message.content.slice(client.prefix).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === 'eval') {
            let dev = ['648236998657835047', '355851488372719618']
            if (!dev.includes(message.author.id)) return;

            try {
                const result = eval(args.join(' '));
                await message.reply(`Result :\n\`\`\`javascript\n${result}\`\`\``);
            } catch (error) {
                await message.reply(`Error :\n\`\`\`javascript\n${error}\`\`\``);
            }
        }
    }
};
