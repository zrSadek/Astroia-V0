module.exports = {
    name: 'messageCreate',
    run: async (client, message) => {
        if (!message.guild || message.author.bot) return;

        const savedData = await client.db.get(`constentmsg_${message.guild.id}_${message.channel.id}`);
        if (!savedData || (!savedData.embed && !savedData.content)) return;

        const { embed, content, msgID } = savedData;
        try {
            if (msgID) {
                const oldMessage = await message.channel.messages.fetch(msgID);
                if (oldMessage) {
                    await oldMessage.delete();
                }
            }

            if (embed) {
                let msg = await message.channel.send({ embeds: [embed] });
                await client.db.set(`constentmsg_${message.guild.id}_${message.channel.id}.msgID`, msg.id);
            } else if (content) {
                await message.channel.send(content);
            }
        } catch (error) {
        }
    }
};
