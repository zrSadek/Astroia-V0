const axios = require("axios");
const Astroia = require("../../structures/client/index");
module.exports = {
    name: "ready",
    
    /**
     * @param {Astroia} client
     */
    
    run: async (client) => {
        try {
            const response = await axios.post(`http://localhost:3000/api/start`, { bot: client.user.id });
        } catch (error) {
            console.error("Manager Error:", error.data ? erreur.data : 'Manager Hors ligne !');
        }
    }
};
