import React, { Component } from "react";
import { Grid, Box, Avatar, IconButton } from '@material-ui/core';
import MessageStatus from "../mesageStatusIcons"
import PriorityHighOutlinedIcon from '@material-ui/icons/Error';
import SpeakerNotesOffOutlinedIcon from '@material-ui/icons/SpeakerNotesOffOutlined';
import moment from "moment";


class YourSide extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSentShown: false
        }
    }

    priorityIcon = () => {
        if (this.props.priority) {
            return <PriorityHighOutlinedIcon fontSize="small" />
        }
    }


    sendingText = () => {
        // return (this.props.sending ? "ETA" : "Estimated Deliverey");

        if (this.props.sending && !this.props.expresp) {
            return "ETA"
        } else if (!this.props.sending && !this.props.expresp) {
            return "Est. Delivery"
        } else if (!this.props.sending && this.props.expresp) {
            return "Delivery"
        }
    };

    messageStatus = () => {
        if (this.props.sending && !this.props.expresp) {
            // Sending
            return (
                <MessageStatus sent="rgba( 128, 128, 128, 1)" ert="rgba( 125, 197, 133, 0)" expresp={this.props.expresp} />
            )
        } else if (!this.props.sending && this.props.expresp) {
            // send, and response is avail
            return <MessageStatus sent="rgba( 125, 197, 133, 1)" ert="rgba( 125, 197, 133, 1)" expresp={this.props.expresp} />
        } else {
            // sent, but time hasnt been reached for response
            return <MessageStatus sent="rgba( 125, 197, 133, 1)" ert="rgba( 125, 197, 133, 0)" expresp={this.props.expresp} />
        }

    }

    countdown = () => {
        let currentTime = moment().utc().format();
        let deliveryTime = moment(this.props.eta);
        let remainingMilliSeconds = deliveryTime.diff(currentTime)
        let display = moment(remainingMilliSeconds).format('mm:ss')
        return display
    }

    sendingandDeliveryRender = () => {

        return (
            <Box component="span" className=" timeDetails deliveryTime ">
                <Box>{this.sendingText()}: </Box>
                <Box>{this.props.timeDelivered}</Box>
            </Box>
        )
    }

    sendingandDeliveryRenderTL = () => {

        let currentTime = Date.now()

        let deliveryTime = new Date(this.props.eta)
        deliveryTime = deliveryTime.getTime()

        if (currentTime < deliveryTime) {
            return (
                <Box component="span" item="true" className=" crewDeliveryChatText timeDelivered">
                    <Box>Time Remaining: {this.countdown()}</Box>
                </Box>
            )
        } else {
            return (
                <Box component="span" item="true" className="crewDeliveryChatText timeDelivered">
                    <Box>{this.sendingText()}: {this.props.timeDelivered}</Box>
                </Box>
            )
        }
    }

    messageColor = () => {
        let thisUser = JSON.parse(localStorage.getItem("User"));
        let userID = thisUser.id

        if (userID === this.props.userId && this.props.sending) {
            if (this.props.priority) {
                return "#F8A95F"
            } else {
                return "#78B5FD"

            }
        } else if (userID === this.props.userId && !this.props.sending) {
            if (this.props.obsolete) {
                return "#CCC4D6"
            } else {
                if (this.props.priority) {
                    return "#f58925"
                } else {
                    return "#147EFB"
                }
            }
        } else if (userID !== this.props.userId && !this.props.sending) {
            if (this.props.obsolete) {
                return "#CCC4D6"
            } else {
                if (this.props.priority) {
                    return "#f58925"
                } else {
                    return "#5FC9F8"
                }
            }
        } else if (userID !== this.props.userId && this.props.sending) {
            if (this.props.priority) {
                return "#F8A95F"
            } else {
                return "#C1EAFC"
            }
        }
    }

    textColor = () => {
        let thisUser = JSON.parse(localStorage.getItem("User"));
        let userID = thisUser.id

        if (userID !== this.props.userId) {
            return "#1a1a1a"
        } else {
            return "#F2F2F2"
        }
    }

    priorityClass = () => {
        if (this.props.priority && !this.props.sending) {
            return "priorityMessage"
        }
    }

    priorityBody = () => {
        if (this.props.priority) {
            return "600"
        } else {
            return "400"
        }
    }

    iconsRender = () => {
        if (this.props.obsoletePress && !this.props.obsolete) {
            // if not Obsolete and O-pressed
            let obsoleteMessage = "Marked as irrelevent. Update is being sent."
            return (
                <Box className="obsoleteText">
                    {obsoleteMessage}
                </Box>
            )
        } else if (this.props.obsoletePress && this.props.obsolete) {
            // if Obsolete and O-pressed
            let obsoleteMessage = `${this.props.obsoleteUser} marked as irrelevent at ${this.props.obsoleteTime}`
            return (
                <Box className="obsoleteText">
                    {obsoleteMessage}
                </Box>
            )
        } else {
            return (
                <IconButton
                    size="small"
                    onClick={this.props.markObsolete}
                    className="messageButton"
                >
                    <SpeakerNotesOffOutlinedIcon />
                </IconButton>
            )
        }


    }

    avatarLetters = () => {
        let userName = this.props.userName;
        let matches = userName.match(/\b(\w)/g);
        let acronym = matches.join('');

        if (acronym.length > 2) {
            return acronym.slice(0, 2)
        } else {
            return acronym
        }
    }

    render = () => {
        return (
            <Box className="Message indivMessage otherCrew">
                <Grid container
                    direction="row"
                    justify="flex-start"
                    alignItems="center">
                    {/* <Box item="true" direction="column" alignItems="center" justify="center" style={{ margin: "0px 10px 0px 0px" }} onMouseEnter={this.setSentTime(true)} onMouseLeave={this.setSentTime(false)}> */}
                    <Box item="true" direction="column" alignItems="center" justify="center" className="centerDetails">
                        <Box item="true" className="timeDetails sentTime">
                            <Box >Sent:</Box>
                            <Box >{this.props.timeSent}</Box>
                        </Box>
                        <Avatar item="true" alt={`${this.props.userId}`} className="avatar" style={{ margin: "0px auto", backgroundColor: `${this.messageColor()}` }}>{this.avatarLetters()}</Avatar>
                        {this.messageStatus()}
                        <Box >{this.sendingandDeliveryRender()}</Box>
                    </Box>
                    <Box className="messageArea" item="true">
                        <Grid item container direction="column" alignItems="flex-start">
                            <Box item="true" className="userNameRole">{this.props.userName}</Box>

                            <Box item="true"
                                className={`chatBubble ${this.priorityClass()}`}
                                justify="center"
                                alignItems="flex-start"
                                style={{ backgroundColor: `${this.messageColor()}` }}
                            >
                                {this.priorityIcon()}
                                <Box className="messageText messData" style={{ color: `${this.textColor()}`, fontWeight: `${this.priorityBody()}` }}>{this.props.messageMessageBody}</Box>
                                {this.sendingandDeliveryRenderTL()}

                            </Box>
                        </Grid>
                        {this.iconsRender()}
                    </Box>

                </Grid>
            </Box >
        )
    }
}

export default YourSide;