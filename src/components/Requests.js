import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Grid,
    IconButton,
    Tooltip,
    Typography,
} from "@material-ui/core";
import { AppBar, Box, Tab, Tabs } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CallReceivedIcon from "@material-ui/icons/CallReceived";
import CallMadeIcon from "@material-ui/icons/CallMade";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../app/firebase";
import { useHistory } from "react-router-dom";
import { red } from "@material-ui/core/colors";
import InfoIcon from "@material-ui/icons/Info";
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        height: "100%",
    },
    tabbutton: {
        "& span": {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            "& svg": {
                marginBottom: "0 !important",
            },
        },
    },
    media: {
        height: 0,
        paddingTop: "56.25%", // 16:9
    },
    expand: {
        transform: "rotate(0deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },
    avatar: {
        backgroundColor: red[500],
    },
    viewButton: {
        marginTop: "15px",
    },
    education: {
        wordBreak: "break-word",
        display: "flex",
    },
    card: {
        height: "100%",
    },
    cardfooter: {
        justifyContent: "flex-end",
    },
    decline: {
        marginLeft: "15px",
    },
    infoiconedu: {
        width: "18px",
        height: "18px",
        cursor: "pointer",
        marginLeft: "3px",
    },
    cardheader: {
        "& div span": {
            fontSize: "1.5rem",
        },
    },
}));
function Requests() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    //current user
    const userDetails = useSelector(selectUser);
    const [loggedinUser, setloggedinUser] = useState(userDetails);
    useEffect(() => {
        setloggedinUser(userDetails);
    }, loggedinUser);
    let loggedinuserEmail = loggedinUser.userData.email;
    const [requests, setrequests] = useState();
    const [sentRequests, setsentRequests] = useState();

    //settting received requests
    useEffect(() => {
        db.collection("users")
            .doc(loggedinuserEmail)
            .collection("interestsreceived")
            .onSnapshot((snapshot) =>
                setrequests(
                    snapshot.docs.map((doc) => ({
                        data: doc.data(),
                    }))
                )
            );
    }, []);

    //setting sent requests
    useEffect(() => {
        db.collection("users")
            .doc(loggedinuserEmail)
            .collection("interestssent")
            .onSnapshot((snapshot) =>
                setsentRequests(
                    snapshot.docs.map((doc) => ({
                        data: doc.data(),
                    }))
                )
            );
    }, []);
    const history = useHistory();
    const gotoProfile = (uid) => {
        history.push("/ProfileN", { params: { uid } });
    };
    const getAge = (dateString) => {
        // getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    console.log(requests);
    const acceptRequest = (requestEmail) => {
        db.collection("users")
            .doc(loggedinuserEmail)
            .collection("interestsreceived")
            .doc(requestEmail)
            .set(
                {
                    accepted: "accepted",
                    read: true,
                },
                { merge: true }
            );
        db.collection("users")
            .doc(requestEmail)
            .collection("interestssent")
            .doc(loggedinuserEmail)
            .set(
                {
                    accepted: "accepted",
                },
                { merge: true }
            );
    };

    const declineRequest = (requestEmail) => {
        db.collection("users")
            .doc(loggedinuserEmail)
            .collection("interestsreceived")
            .doc(requestEmail)
            .set(
                {
                    accepted: "declined",
                    read: true,
                },
                { merge: true }
            );
        db.collection("users")
            .doc(requestEmail)
            .collection("interestssent")
            .doc(loggedinuserEmail)
            .set(
                {
                    accepted: "declined",
                },
                { merge: true }
            );
    };
    return (
        <div>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
                indicatorColor="primary"
            >
                <Tab
                    className={classes.tabbutton}
                    label="Recieved"
                    icon={<CallReceivedIcon />}
                    {...a11yProps(0)}
                />
                <Tab
                    className={classes.tabbutton}
                    label="Sent"
                    icon={<CallMadeIcon />}
                    {...a11yProps(1)}
                />
            </Tabs>
            <TabPanel value={value} index={0}>
                <Grid container spacing={3}>
                    {requests?.map((request, index) => (
                        <Grid item xs={12} sm={4} lg={3}>
                            <Card className={classes.root}>
                                <CardHeader
                                    className={classes.cardheader}
                                    avatar={
                                        <Avatar
                                            aria-label={request.data.name}
                                            className={classes.avatar}
                                        >
                                            {request.data.name.charAt(0)}
                                        </Avatar>
                                    }
                                    title={request.data.name}
                                    subheader={request.data.residingcity}
                                />
                                <CardMedia
                                    className={classes.media}
                                    image={request.data.dp}
                                    title={request.data.name}
                                />
                                <CardContent>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                    >
                                        <div className="mat__profiles-ageheight">
                                            <div className="mat__profiles-age">
                                                <span> Age:</span>

                                                <span>
                                                    {
                                                        (console.log(
                                                            request.data.dob
                                                        ),
                                                        getAge(
                                                            new Intl.DateTimeFormat(
                                                                "en-US",
                                                                {
                                                                    year: "numeric",
                                                                    month: "2-digit",
                                                                    day: "2-digit",
                                                                }
                                                            ).format(
                                                                request.data?.dob?.toDate()
                                                            )
                                                        ))
                                                    }{" "}
                                                    Years
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mat__profiles-nakshatra">
                                            <span>Nakshatra:</span>
                                            <span>{request.data.star}</span>
                                        </div>
                                        <div className="mat__profiles-nakshatra">
                                            <span>Raashi:</span>
                                            <span>{request.data.raashi}</span>
                                        </div>
                                        <div className="mat__profiles-nakshatra">
                                            <span>Gothra:</span>
                                            <span>{request.data.gothra}</span>
                                        </div>
                                        <div className={classes.education}>
                                            <span>Education:</span>

                                            <span>
                                                {
                                                    /\(([^)]+)\)/.exec(
                                                        request.data.education
                                                    )[1]
                                                }
                                            </span>
                                            <Tooltip
                                                title={request.data.education.replace(
                                                    / *\([^)]*\) */g,
                                                    ""
                                                )}
                                            >
                                                <InfoIcon
                                                    className={
                                                        classes.infoiconedu
                                                    }
                                                />
                                            </Tooltip>
                                        </div>

                                        {/* {new Date(
                                    request.data.birthdate._seconds * 1000
                                ).toLocaleDateString("en-US")} */}
                                    </Typography>
                                    <Button
                                        size="small"
                                        color="primary"
                                        className={classes.viewButton}
                                        onClick={() =>
                                            gotoProfile(request.data.email)
                                        }
                                    >
                                        Goto Profile
                                    </Button>
                                </CardContent>
                                <CardActions
                                    disableSpacing
                                    classname={classes.cardfooter}
                                >
                                    {!request.data.accepted ? (
                                        <>
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                onClick={(e) =>
                                                    acceptRequest(
                                                        request.data.email
                                                    )
                                                }
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                className={classes.decline}
                                                onClick={(e) =>
                                                    declineRequest(
                                                        request.data.email
                                                    )
                                                }
                                            >
                                                <strong>Decline</strong>
                                            </Button>
                                        </>
                                    ) : (
                                        <div>
                                            You have{" "}
                                            {request.data.accepted ===
                                            "accepted"
                                                ? "accepted"
                                                : "declined"}{" "}
                                            the request from {request.data.name}
                                        </div>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Grid container spacing={3}>
                    {sentRequests?.map((sentRequest, index) => (
                        <Grid item xs={12} sm={4} lg={3}>
                            <Card className={classes.root}>
                                <CardHeader
                                    className={classes.cardheader}
                                    avatar={
                                        <Avatar
                                            aria-label={sentRequest.data.name}
                                            className={classes.avatar}
                                        >
                                            {sentRequest.data.name.charAt(0)}
                                        </Avatar>
                                    }
                                    title={sentRequest.data.name}
                                    subheader={sentRequest.data.residingcity}
                                />
                                <CardMedia
                                    className={classes.media}
                                    image={sentRequest.data.dp}
                                    title={sentRequest.data.name}
                                />
                                <CardContent>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                    >
                                        <div className="mat__profiles-ageheight">
                                            <div className="mat__profiles-age">
                                                <span> Age:</span>

                                                <span>
                                                    {
                                                        (console.log(
                                                            sentRequest.data.dob
                                                        ),
                                                        getAge(
                                                            new Intl.DateTimeFormat(
                                                                "en-US",
                                                                {
                                                                    year: "numeric",
                                                                    month: "2-digit",
                                                                    day: "2-digit",
                                                                }
                                                            ).format(
                                                                sentRequest.data?.dob?.toDate()
                                                            )
                                                        ))
                                                    }{" "}
                                                    Years
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mat__profiles-nakshatra">
                                            <span>Nakshatra:</span>
                                            <span>{sentRequest.data.star}</span>
                                        </div>
                                        <div className="mat__profiles-nakshatra">
                                            <span>Raashi:</span>
                                            <span>
                                                {sentRequest.data.raashi}
                                            </span>
                                        </div>
                                        <div className="mat__profiles-nakshatra">
                                            <span>Gothra:</span>
                                            <span>
                                                {sentRequest.data.gothra}
                                            </span>
                                        </div>
                                        <div className={classes.education}>
                                            <span>Education:</span>
                                            <span>
                                                {
                                                    /\(([^)]+)\)/.exec(
                                                        sentRequest.data
                                                            .education
                                                    )[1]
                                                }
                                            </span>
                                            <Tooltip
                                                title={sentRequest.data.education.replace(
                                                    / *\([^)]*\) */g,
                                                    ""
                                                )}
                                            >
                                                <InfoIcon
                                                    className={
                                                        classes.infoiconedu
                                                    }
                                                />
                                            </Tooltip>
                                        </div>

                                        {/* {new Date(
                                    sentRequest.data.birthdate._seconds * 1000
                                ).toLocaleDateString("en-US")} */}
                                    </Typography>
                                    <Button
                                        size="small"
                                        color="primary"
                                        className={classes.viewButton}
                                        onClick={() =>
                                            gotoProfile(sentRequest.data.email)
                                        }
                                    >
                                        Goto Profile
                                    </Button>
                                </CardContent>
                                <CardActions
                                    disableSpacing
                                    classname={classes.cardfooter}
                                >
                                    {!sentRequest.data.accepted ? (
                                        <div>
                                            {sentRequest.data.name} has not
                                            accepted/declined yor request yet!
                                        </div>
                                    ) : (
                                        <div>
                                            {sentRequest.data.name} has
                                            {sentRequest.data.accepted ===
                                            "accepted"
                                                ? " accepted"
                                                : " declined"}{" "}
                                            your request.
                                        </div>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>
        </div>
    );
}

export default Requests;
