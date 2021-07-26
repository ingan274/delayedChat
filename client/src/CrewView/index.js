import React, { Component } from "react";
import { Grid, Box, IconButton, TextField } from '@material-ui/core';
import { SendRounded } from '@material-ui/icons';
import dateTime from "../API-Calls/chatDelay.js"
import API from "../API-Calls/index.js";
import New from "../Components/New";
import moment from "moment";

class Playbook extends Component {
    constructor(props) {
        super(props);


        let userObj = JSON.parse(localStorage.getItem("User"));

        this.state = {
            userName: userObj.name,
            userId: userObj.id,
            userLocation: userObj.location,
            chatSent: [],
            chatSending: [],
            messageBody: "",
            priority: false,
            nextDeliveryTime: "",
            currentTime: "",
            currentDate: "",
            deliveryBSON: "",
            currentBSON: ""
        }
    }

    // getting data functions
    componentDidMount = async () => {
        this.getMessagesSent();
        this.getMessagesSending();

        let delay = dateTime.delay;
        // Get Messages every 1 seconds
        setInterval(() => {
            this.getMessagesSent();
            this.getMessagesSending();
        }, 1000);

        // Scroll To Red Line
        let cycle = 1
        let scrollDown = setInterval(() => {
            if (cycle === 0) {
                clearInterval(scrollDown)
            }
            this.scrollToLine();
            cycle--
        }, 1000);


        // Update time every second
        setInterval(() => {

            let time = moment().utc().format()
            let nowTimestamp = (this.getTime(time))
            let nowDate = time.slice(0, 10)

            let delayedTimeStamp = moment().add(delay).utc().format()
            let deliveryTime = (this.getTime(delayedTimeStamp))
            this.setState({
                nextDeliveryTime: deliveryTime,
                currentTime: nowTimestamp,
                currentDate: nowDate,
                currentBSON: time.valueOf(),
                deliveryBSON: delayedTimeStamp.valueOf(),
            })

        }, 1000);

    }

    getMessagesSending = () => {
        API.getMCCCrew(this.state.userLocation).then((res) => {
            this.setState({
                chatSending: res.data
            })
        })
    }

    getMessagesSent = () => {
        API.getMCCCrewSent().then((res) => {
            // console.log(res.data)
            this.setState({
                chatSent: res.data
            })
        })
    }

    getTime = (time) => {
        let timestamp = time.slice(11,)
        timestamp = timestamp.slice(0, 8)
        return timestamp
    }

    // input functions
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        })
    }

    handleSubmitMessage = event => {
        if (this.state.messageBody) {

            const newMesssage = {
                message: {
                    messageBody: this.state.messageBody
                },
                priority: this.state.priority,
                sender: this.state.userId,
                senderName: this.state.userName,
                location: true,
                sentTime: this.state.currentBSON,
                deliveryTime: this.state.deliveryBSON,
            }


            API.newMCCCrew(newMesssage);
            this.setState({
                messageBody: "",
            })

            this.getMessagesSending();

        }
    }


    scrollToLine = () => {
        // Scroll to the bottom
        // let sent = document.getElementById('sentBox');
        // let line = ;
        // line.scrollTop = sent.scrollHeight - sent.clientHeight / 3;

        document.getElementById('redline').scrollIntoView({ block: "center" })
    }

    // GOOD
    markObsolete = (messageid, event) => {
        let messageID = messageid
        // console.log(messageID)
        const userUpdated = this.state.userName;
        const timeUpdated = this.state.currentTime;

        let udpateObject = {
            messageID: messageID,
            userUpdated: userUpdated,
            timeUpdated: timeUpdated
        }

        API.markObsolete(udpateObject)
    }
    // GOOD
    keyPress = (ev) => {

        if (ev.keyCode === 13) {
            ev.preventDefault();
            this.handleSubmitMessage()
        }
    }

    // Renderings
    renderMessagesSent = () => {
        if (this.state.chatSent.length > 0) {
            return (
                <Box className="ChatBox chatMessDivSent" id="sentBox" item="true">
                    {this.state.chatSent.map((item, index) => {
                        return (
                            <New
                                key={index.toString()}
                                messageID={item._id}
                                location={item.location}
                                sending={item.sending}
                                expresp={item.expected_resp}
                                messageSubject={item.message.subject}
                                messageMessageBody={item.message.messageBody}
                                userName={item.senderName}
                                userId={item.sender}
                                timeSent={this.getTime(item.timeSent)}
                                timeDelivered={this.getTime(item.timeDelivered)}
                                eta={item.timeDelivered}
                                markObsolete={(ev) => this.markObsolete(item._id, ev)}
                                obsolete={item.obsolete.isObsolete}
                                obsoletePress={item.obsoletePressed}
                                obsoleteUser={item.obsolete.userChange}
                                obsoleteTime={item.obsolete.timeChange}
                                priority={item.priority}
                            />
                        )


                    })}
                </Box>
            )
        } else {
            return (
                <Box className="ChatBox chatMessDivSent" item="true"></Box>
            )

        }
    }

    renderMessagesSending = () => {
        if (this.state.chatSending.length > 0) {
            return (
                <Box className="ChatBox chatMessDivSending" item="true">
                    {this.state.chatSending.map((item, index) => {
                        return (
                            <New
                                key={index.toString()}
                                messageID={item._id}
                                location={item.location}
                                sending={item.sending}
                                expresp={item.expected_resp}
                                messageSubject={item.message.subject}
                                messageMessageBody={item.message.messageBody}
                                userName={item.senderName}
                                userId={item.sender}
                                timeSent={this.getTime(item.timeSent)}
                                timeDelivered={this.getTime(item.timeDelivered)}
                                eta={item.timeDelivered}
                                markObsolete={(ev) => this.markObsolete(item._id, ev)}
                                obsolete={item.obsolete.isObsolete}
                                obsoletePress={item.obsoletePressed}
                                obsoleteUser={item.obsolete.userChange}
                                obsoleteTime={item.obsolete.timeChange}
                                priority={item.priority}
                            />
                        )
                    })}
                </Box>
            )
        } else {
            return (
                <Box className="ChatBox chatMessDivSending" item="true"></Box>
            )
        }
    }


    render = () => {
        return (
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="center"
            >
                <Grid item container direction="row" className="timeHeader" alignItems="center" justify="center">
                    <Box item="true" className="currentDT">Date: {this.state.currentDate} <Box className="centerSpaceTime" component="span" mr={5}> </Box> Current Time: {this.state.currentTime}</Box>
                </Grid>

                <Box className="chatContainer">
                    <Box className="timelineLineDiv"><Box className="timelineLine"></Box></Box>
                    {this.renderMessagesSent()}
                    <Box className="hLine" id='redline'></Box>
                    {this.renderMessagesSending()}
                    <Box className="chatBoxInput">
                        <form encType="multipart/form-data">
                            <Grid
                                style={{ padding: ".75em" }}
                                container item
                                direction="column"
                                justify="center"
                                alignItems="center">
                                <Box item="true" className="form-control">
                                    <Grid
                                        container item
                                        direction="row"
                                        justify="center"
                                        alignItems="center">
                                        <TextField className="inputArea"
                                            autoFocus
                                            variant="filled"
                                            size="small"
                                            name="messageBody"
                                            value={this.state.messageBody}
                                            label={`Message (ETA - ${this.state.nextDeliveryTime})`}
                                            onChange={this.handleInputChange}
                                            onKeyPress={(ev) => {
                                                if (ev.key === 'Enter') {
                                                    ev.preventDefault();
                                                    this.handleSubmitMessage()
                                                }
                                            }}
                                            multiline
                                            inputProps={{
                                                style: {
                                                    fontSize: '12px',
                                                },
                                            }}
                                            inputLabelProps={{
                                                style: {
                                                    fontSize: '12px',
                                                },
                                            }}
                                            onKeyDown={this.keyPress}
                                        />
                                        <IconButton type="submit" aria-label="Send" component="span" onClick={this.handleSubmitMessage} >
                                            <SendRounded />
                                        </IconButton>
                                    </Grid>
                                </Box>
                            </Grid>
                        </form>
                    </Box>
                </Box>
            </Grid >
        )
    }
}

export default Playbook;