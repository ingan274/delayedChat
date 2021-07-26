import React, { Component } from "react";
import { Grid } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';


class YouReply extends Component {

    render = () => {
        let colorSent = {
            color: this.props.sent,
            width: "17px",
            transform: "rotate(180deg)",
            margin: "-5px 0px -8px"

        }

        let colorERT = {
            color: this.props.ert,
            width: "17px",
            marginBottom: "-8px",
            marginTop: "-10px"
        }


        return (
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                className="messageStatusDiv">
                <ArrowRightAltIcon className="checkSent" style={colorSent} />
                <ArrowRightAltIcon className="checkERT" style={colorERT} />
            </Grid>

        )
    }
}

export default YouReply;