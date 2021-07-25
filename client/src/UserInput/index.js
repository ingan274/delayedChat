import "./style.css";
import React, { Component } from "react";
import { Grid, Box, Button, TextField } from '@material-ui/core';
import logo from "../Assets/chronosLogo.png"
import moment from "moment";
import {
    Link,
} from "react-router-dom";

class Playbook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
        }

    }

    // input functions
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        })
    }

    handleSubmitName = () => {
        const name = this.state.name;
        const location = "mars";
        const lowercase = name.toLowerCase().replace(/\s/g, '');
        const id = lowercase + `${moment().utc().format('x')}`

        const userObject = {
            id: id,
            name: name,
            location: location
        }


        let localStorageUser = JSON.stringify(userObject);
        localStorage.setItem("User", localStorageUser);
    }

    // Creating Profile Buttons
    profileButtons = () => {
        let buttonColor;

        if (this.state.name !== "") {
            buttonColor = "primary"
        }

        return (
            <Grid container
                direction="column"
                justify="space-between"
                alignItems="center"
                style={{ height: "100vh" }}>
                <Box item="true" style={{ width: "15vw", paddingTop: "2em" }}>
                    <img src={logo} style={{ width: "100%" }} alt="chronos logo"/>
                </Box>
                <Box item="true" style={{ width: "30vw" }}>
                    <Box style={{ margin: "1em 0em" }}>
                        Please Enter Your Full Name
                    </Box>
                    <TextField className="nameInput"
                        autoFocus
                        variant="filled"
                        name="name"
                        value={this.state.name}
                        label={`Your Name`}
                        onChange={this.handleInputChange}
                    />
                    <Link to="/crew" className="userSubmit" style={{ textDecoration: "none" }}>
                        <Button variant="contained" color={buttonColor} onClick={this.handleSubmitName} style={{ margin: "3em 0em" }}>Enter Chat</Button>
                    </Link>
                </Box>
                <Box item="true" style={{ fontSize: "10px", paddingBottom: "1em" }}>
                    Welcome to Deep Space Communication
                </Box>
            </Grid>
        )
    }

    render = () => {
        return (
            this.profileButtons()
        )
    }
}

export default Playbook;