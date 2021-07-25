// const connect = require("../connect");
const databasecalls = require('./dbconnection')

let mcccrew;

module.exports = {
    database: (client) => {
        const dbName = 'presentationMessages';
        const database = client.db(dbName)
        // Check if collections exist, if not then create them and set validation
        let collections = database.listCollections().toArray()

        // BSON types
        // string ("string")- text
        // double ("double") - floating point values
        // Object ("object") - object
        // ObjectId ("objectId") - floating point values
        // integer ("int")- number up to 36-bit

        if (collections.length === 0) {
            database.createCollection("mcc-crew-chat", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["message", "priority", "urgent", "sending", "expected_resp", "sender", "timeSent", "timeDelivered", "location"],
                        properties: {
                            message: {
                                bsonType: "object",
                                properties: {
                                    messageBody: {
                                        bsonType: "string",
                                        description: "must be a string and is required"
                                    }
                                }
                            },
                            priority: {
                                bsonType: "bool",
                                description: "must be a bool - timer will change with timer"
                            },
                            obsoletePressed: {
                                bsonType: "bool",
                                description: "must be a bool, timer wull update the bottom later"
                            },
                            obsolete: {
                                bsonType: "object",
                                required: ["isObsolete"],
                                properties: {
                                    isObsolete: {
                                        bsonType: "bool",
                                        description: "must be a bool and is required"
                                    },
                                    userChange: {
                                        bsonType: "string",
                                        description: "Person Who Set It"
                                    },
                                    timeChange: {
                                        bsonType: "string",
                                        description: "Time it was changed"
                                    }
                                }
                            },
                            sending: {
                                bsonType: "bool",
                                description: "must be a bool - timer will change with timer"
                            },
                            expected_resp: {
                                bsonType: "bool",
                                description: "must be a bool - timer will change with timer after sending"
                            },
                            sender: {
                                bsonType: "string",
                                description: "senderID"
                            },
                            senderName: {
                                bsonType: "string",
                                description: "senderName"
                            },
                            timeCreated: {
                                bsonType: "date",
                                description: "must be a time"
                            },
                            timeSent: {
                                bsonType: "date",
                                description: "must be a time"
                            },
                            timeDelivered: {
                                bsonType: "date",
                                description: "must be a time"
                            },
                            location: {
                                bsonType: "bool",
                                description: "0 is earth and 1 is mars"
                            }
                        }
                    }
                }
            })

            mcccrew = database.collection('mcc-crew-chat');

            let dbs = databasecalls.mongocalls(mcccrew)
            return dbs

        } else {
            mcccrew = database.collection('mcc-crew-chat');

            let dbs = databasecalls.mongocalls(mcccrew)
            return dbs
        }
    },
};
