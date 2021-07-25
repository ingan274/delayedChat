const { ObjectID } = require("bson");
const mongoConnect = require('../connect');
const delay = require("./delay");

const timerDelay = delay
const secondDelay = delay * 2

let mcccrew;
// Connect to MongoDB
// Connecting to Local Mongo URI
// const MONGO_URI = 'mongodb://localhost:27017';
// Updated Mongo URI for Atlas
const MONGO_URI = "mongodb+srv://mhcinasa2021:Nasa2021Mhci@playbook.iamit.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// mongodb+srv://mhcinasa2021:<password>@playbook.iamit.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const dbs = async () => {
    let dbconnected = await mongoConnect.connection(MONGO_URI)
    // console.log(dbconnected)
    mcccrew = dbconnected.mgdbmcccrew

}
dbs()

const updateToSent = async (messageID) => {
    let changeToSent = {
        $set: {
            sending: false
        }
    }
    await mcccrew.updateOne({ _id: ObjectID(messageID) }, changeToSent)
        .then(console.log("MCC Crew Message", messageID, " (Message): has beeen SENT"))
        .catch(err => {
            console.log(err)
        })

}

const updatedToPossibleReply = async (messageID) => {

    let changeToEAR = {
        $set: {
            expected_resp: true
        }
    }
    await mcccrew.updateOne({ _id: ObjectID(messageID) }, changeToEAR)
        .then(console.log("Message", messageID, " (Message): could get a response"))
        .catch(err => {
            console.log(err)
        })
}

const markObsolete = async (messageID, user, time) => {

    let ignoreMessage = {
        $set: {
            obsolete: {
                isObsolete: true,
                userChange: userChange,
                timeChange: timeChange
            }
        }
    }

    await mcccrew.updateOne({ _id: ObjectID(messageReactingTo) }, ignoreMessage)
        .then(console.log("Message", messageReactingTo, "has beeen Ignored"))
        .catch(err => {
            console.log(err)
        })
}

module.exports = {
    // // Get Messages
    // Find all messages for MCC and Crew Chat and organize by as received
    chatMCCCrew: async (req, res) => {
        let location = req.params.location;
        let organizedMesObj;
        if (location === "mars") {
            // User sending messages
            let userSendingMesage = await mcccrew.find({ location: true, sending: true })
                .sort({ timeDelivered: 1 })
                .toArray();

            // organizingMessages(myTimeMessages, otherTimeMessages);

            if (userSendingMesage.length > 0) {
                // Sending MCC-Crew Chat from Crew Perspective
                res.send(userSendingMesage);
            } else {
                res.send([]);
            }


        } else if (location === "earth") {
            // User sending messages
            let userSendingMesage = await mcccrew.find({ location: false, sending: true })
                .sort({ timeDelivered: 1 })
                .toArray();

            // organizingMessages(myTimeMessages, otherTimeMessages);

            if (userSendingMesage.length > 0) {
                // Sending MCC-Crew Chat from Crew Perspective
                res.send(userSendingMesage);
            } else {
                res.send([]);
            }

        }


        return
    },

    sentMessages: async (req, res) => {
        // Crew Perspective
        let deliveredMessages = await mcccrew.find({ sending: false })
            .sort({ timeDelivered: 1 })
            .toArray();

        if (deliveredMessages.length > 0) {
            // Sending MCC-Crew Chat from Crew Perspective
            res.send(deliveredMessages);
        } else {
            res.send([]);
        }

        return
    },

    // //Insert Messages
    // New MCC Crew Chat Message
    newMessageMCCCrew: async (req, res) => {
        let message = {
            message: req.body.message,
            priority: req.body.priority,
            obsoletePressed: false,
            obsolete: {
                isObsolete: false,
                userChange: "",
                timeChange: ""
            },
            sending: true,
            expected_resp: false,
            sender: req.body.sender,
            senderName: req.body.senderName,
            timeSent: req.body.sentTime,
            timeDelivered: req.body.deliveryTime,
            location: req.body.location
        }


        if (req.body.reminder) {
            message.reminder = req.body.reminder
        }

        await mcccrew.insertOne(message)
            .then((result) => {
                console.log("Chat has been submitted to MCC Crew Chat")
                // console.log(result.ops[0])
                const messageID = result.ops[0]._id

                let cycle = 2

                let send = setInterval(async () => {
                    if (cycle === 1) {
                        clearInterval(send);
                        return;
                    }
                    await updateToSent(messageID).catch(err => console.log(err))
                    cycle--;
                }, timerDelay);

                let ert = setInterval(async () => {
                    if (cycle === 0) {
                        clearInterval(ert);
                        return;
                    }
                    await updatedToPossibleReply(messageID).catch(err => console.log(err))
                    cycle--;
                }, secondDelay);
            })
            .catch((status, err) => {
                console.log(err)
                res.sendStatus(status)
            });
    },


    // UPDATES TO MESSAGE

    mccObsoletePress: async (req, res) => {
        const messageReactingTo = req.body.message.messageID;
        const userChange = req.body.message.userUpdated;
        const timeChange = req.body.message.timeUpdated;

        let obsoletePress = {
            $set: {
                obsoletePressed: true
            }
        }

        await mcccrew.updateOne({ _id: ObjectID(messageReactingTo) }, obsoletePress)
            .then(() => {
                console.log("Message", messageReactingTo, "obsolete (pressed)")
                let cycle = 1
                let updateMessage = setInterval(async () =>  {
                    if (cycle === 0) {
                        clearInterval(updateMessage);
                        return;
                    }
                    await markObsolete(messageReactingTo, userChange, timeChange).catch(err => console.log(err))
                    cycle--;
                }, timerDelay);
            })
            .catch(err => {
                console.log(err)
                res.send(404)
            })

    },
}