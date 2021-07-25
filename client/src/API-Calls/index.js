
import axios from "axios";

const APICall = {
    // MCC Crew Chat
    getMCCCrew: (location) => axios.get(`/api/mcccrew/${location}`),
    
    getMCCCrewSent: () => axios.get("/api/mcccrew"),

    newMCCCrew: (newMessage) => {
        axios.post("/api/mcccrew/", newMessage)
    },

    markObsolete: (ignoreMessage) => {
        axios.put("/api/mcccrew/ignorepress", { message: ignoreMessage })
    }
}

export default APICall;