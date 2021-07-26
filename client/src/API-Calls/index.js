
import axios from "axios";

const url = "https://cmumhcinasaserver.herokuapp.com"
const APICall = {
    // MCC Crew Chat
    getMCCCrew: (location) => axios.get(`${url}/api/mcccrew/${location}`),
    
    getMCCCrewSent: () => axios.get(`${url}/api/mcccrew`),

    newMCCCrew: (newMessage) => {
        axios.post(`${url}/api/mcccrew`, newMessage)
    },

    markObsolete: (ignoreMessage) => {
        axios.put(`${url}/api/mcccrew/ignorepress`, { message: ignoreMessage })
    }
}

export default APICall;