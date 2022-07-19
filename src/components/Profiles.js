import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Button, Grid } from "@material-ui/core";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
import { db } from "../app/firebase";
import PermContactCalendarOutlinedIcon from "@material-ui/icons/PermContactCalendarOutlined";
import HeightOutlinedIcon from "@material-ui/icons/HeightOutlined";
import StarBorderTwoToneIcon from "@material-ui/icons/StarBorderTwoTone";
import CastForEducationTwoToneIcon from "@material-ui/icons/CastForEducationTwoTone";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import Tooltip from "@material-ui/core/Tooltip";
import "./Profiles";
import { useTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import MuiAlert from "@material-ui/lab/Alert";
import InfoIcon from "@material-ui/icons/Info";

import movieApi from "../apis/movieApi";
import { APIKey } from "../apis/MovieApiKey";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: "100%",
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
    education: {
        wordBreak: "break-word",
        display: "flex",
    },
    infoiconedu: {
        width: "18px",
        height: "18px",
        cursor: "pointer",
        marginLeft: "3px",
    },
    avatar: {
        backgroundColor: red[500],
    },
    viewButton: {
        marginTop: "15px",
    },
    cardfooter: {
        // justifyContent: "center",
        marginTop: "auto",
        paddingTop: "0",
        padding: "0 16px 8px",
        "& button": {
            margin: "0 5px",
        },
    },
}));

export default function Profiles() {
    const classes = useStyles();
    const theme = useTheme();
    const [expanded, setExpanded] = React.useState(false);

    const userDetails = useSelector(selectUser);
    const [user, setUser] = useState(userDetails);
    const [profiles, setProfiles] = useState([]);
    useEffect(() => {
        setUser(userDetails);
    }, [userDetails]);
    // console.log(user);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const getAge = (dateString) => {
        // getAge(dateString) {
        // console.log(dateString + "datestring");
        var today = new Date();
        // var birthDate = new Date(dateString);
        var birthDate;
        dateString.seconds
            ? (birthDate = new Date(
                  dateString.seconds * 1000 + dateString.nanoseconds / 1000000
              ))
            : (birthDate = new Date(dateString));
        birthDate = new Date(
            dateString.seconds * 1000 + dateString.nanoseconds / 1000000
        );
        console.log(birthDate.getFullYear() + "year");
        // birthDate = birthDate.toDate();
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    const genderSearch = user?.userData?.gender === "male" ? "female" : "male";
    // console.log(genderSearch);

    const getProfiles = db
        .collection("users")
        .where("gender", "==", genderSearch)
        .get();
    // useEffect(() => {
    //     getProfiles
    //         .then((querySnapshot) => {
    //             querySnapshot.forEach((doc) => {
    //                 // doc.data() is never undefined for query doc snapshots
    //                 console.log(doc.id, " => ", doc.data());
    //                 setProfiles(doc.data());
    //             });
    //         })
    //         .catch((error) => {
    //             console.log("Error getting documents: ", error);
    //         });
    // }, []);
    useEffect(() => {
        const movieText = "Harry";
        const fetchMovies = async () => {
          const response = await movieApi
            .get(`?apiKey=${APIKey}&type=movie`) 
            .catch((err) => {
              console.log("Err:", err);
              console.log("here");
            });
          console.log("response", response);
        };
        fetchMovies();
      }, []);
    useEffect(() => {
        db.collection("users")
            .where("gender", "==", genderSearch)
            .onSnapshot((snapshot) =>
                setProfiles(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
            );
    }, []);
    // var profilesRef = db.collection("users");
    // var profiles = profilesRef.where("gender", "==", genderSearch);
    const history = useHistory();
    const gotoProfile = (uid) => {
        console.log(uid);
        // history.push("/Profile", { params: { uid } });
        history.push("/ProfileN", { params: { uid } });
        // history.push("./Profile/:uid");
    };

    console.log(profiles);
    const userlogged = firebase.auth().currentUser;
    const loggedinuserEmail =
        userlogged?.email.charAt(0).toUpperCase() + userlogged?.email.slice(1);
    console.log(loggedinuserEmail);
    var userRef = db.collection("users").doc(loggedinuserEmail);
    const [openSnackbar, setopenSnackbar] = useState(false);
    const [snackbarmsg, setsnackbarmsg] = useState();
    const [snackbartype, setsnackbartype] = useState();
    const removeshortlist = (removershortlistmail) => {
        userRef.set(
            {
                shortlisted:
                    firebase.firestore.FieldValue.arrayRemove(
                        removershortlistmail
                    ),
            },
            { merge: true }
        );
        db.collection("users")
            .doc(loggedinuserEmail)
            .collection("shortlisted")
            .doc(removershortlistmail)
            .delete()
            .then(() => {
                // console.log("Document successfully deleted!");
                setsnackbarmsg("Successfully removed from shortlist");
                setsnackbartype("error");
                setopenSnackbar(true);
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
            });

        //removing a array in viewingprofile
        db.collection("users")
            .doc(removershortlistmail)
            .set(
                {
                    shortlistedme:
                        firebase.firestore.FieldValue.arrayRemove(
                            loggedinuserEmail
                        ),
                },
                { merge: true }
            );
        // removing the logged in  user snippet in viewingprofile
        db.collection("users")
            .doc(removershortlistmail)
            .collection("shortlistedme")
            .doc(loggedinuserEmail)
            .delete()
            .then(() => {
                console.log("Document successfully deleted!");
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
            });
    };
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setopenSnackbar(false);
    };

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
    //  const userDetails = useSelector(selectUser);
    //  const [user, setUser] = useState(userDetails);
    useEffect(() => {
        setUser(userDetails);
    }, [userDetails]);

    useEffect(() => {
        const usersRef = db
            .collection("users")
            .doc(loggedinuserEmail.toLowerCase());
        usersRef.get().then((docSnapshot) => {
            if (docSnapshot.exists) {
                usersRef.onSnapshot((doc) => {
                    console.log(
                        "Current user data:",
                        doc.data() + loggedinuserEmail
                    );
                    setloggedinprofile(doc.data());
                });
            } else {
                console.log("not there");
                //   usersRef.set({...}) // create the document
            }
        });
    }, [loggedinuserEmail]);

    const [loggedinprofile, setloggedinprofile] = useState([]);
    console.log(loggedinprofile);
    console.log(loggedinuserEmail);

    useEffect(() => {
        db.collection("users")
            .doc(loggedinuserEmail)
            .onSnapshot((doc) => {
                console.log(
                    "Current user data:",
                    doc.data() + loggedinuserEmail
                );
                setloggedinprofile(doc.data());
            });
    }, [loggedinuserEmail]);

    const sendInterest = (intersetedProfile) => {
        alert();
        //adding a array of in logged in user
        userRef.set(
            {
                interestssent: firebase.firestore.FieldValue.arrayUnion(
                    intersetedProfile.data.email
                ),
            },
            { merge: true }
        );
        // adding the interested user snippet in logged in user(myintersets(loggedin user) snippet)
        db.collection("users")
            .doc(loggedinuserEmail)
            .collection("interestssent")
            .doc(intersetedProfile.data.email)
            .set({
                email: intersetedProfile?.data?.email,
                name: intersetedProfile?.data?.name,
                education: intersetedProfile?.data?.education,
                star: intersetedProfile?.data?.star,
                raashi: intersetedProfile?.data?.raashi,
                gothra: intersetedProfile?.data?.gothra,
                dob: intersetedProfile?.data?.dob,
                dp: intersetedProfile?.data?.dp,
                accepted: false,
                read: false,
            });

        //adding a array in viewingprofile (shortlisted me array)
        db.collection("users")
            .doc(intersetedProfile?.data?.email)
            .set(
                {
                    interestsreceived:
                        firebase.firestore.FieldValue.arrayUnion(
                            loggedinuserEmail
                        ),
                },
                { merge: true }
            );

        // adding the logged in  user snippet in viewingprofile(shortlisted me snippet)
        db.collection("users")
            .doc(intersetedProfile?.data?.email)
            .collection("interestsreceived")
            .doc(loggedinuserEmail)
            .set({
                email: loggedinprofile.email,
                name: loggedinprofile.name,
                education: loggedinprofile.education,
                star: loggedinprofile.birthstar,
                raashi: loggedinprofile.raashi,
                gothra: loggedinprofile.gothra,
                dob: loggedinprofile.birthdate,
                dp: loggedinprofile.profilepic,
                accepted: false,
                read: false,
            })
            .then(() => {
                // console.log("Document successfully deleted!");
                setsnackbarmsg(
                    `Successfully sent interest to ${intersetedProfile?.data?.name}`
                );
                setsnackbartype("success");
                setopenSnackbar(true);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    };

    const [interestSent, setinterestSent] = useState();
    const [interestReceived, setinterestReceived] = useState();

    // useEffect(() => {
    //     db.collection("users")
    //         .doc(loggedinuserEmail)
    //         .collection("interestssent")
    //         .doc(userid)
    //         .onSnapshot((doc) => {
    //             setinterestSent(doc.data());
    //         });

    //     // }
    // }, []);

    // useEffect(() => {
    //     // });
    //     db.collection("users")
    //         .doc(email)
    //         .collection("interestsreceived")
    //         .doc(userid)
    //         .onSnapshot(
    //             (doc) => {
    //                 console.log(doc.data());
    //                 setinterestReceived(doc.data());
    //             },
    //             (error) => {
    //                 console.log(error);
    //             }
    //         );

    //     // }
    //     console.log(email);
    // }, []);
    const shortlistrr = ([shortlist], e) => {
        console.log(shortlist);
        console.log(
            user?.userData?.name,
            user?.userData?.education,
            user?.userData?.email,
            user?.userData?.birthstar,
            user?.userData?.raashi,
            user?.userData?.gothra,
            user?.userData?.birthdate,
            user?.userData?.profilepic
        );
        //adding a array in logged in user(myshortlist(loggedin user) array)
        db.collection("users")
            .doc(`${loggedinuserEmail}`)
            .set(
                {
                    shortlisted: firebase.firestore.FieldValue.arrayUnion(
                        shortlist.data.email
                    ),
                },
                { merge: true }
            );

        // adding the shortlisted user snippet in logged in user(myshortlist(loggedin user) snippet)
        db.collection("users")
            .doc(loggedinuserEmail)
            .collection("shortlisted")
            .doc(shortlist.data.email)
            .set({
                email: shortlist?.data?.email,
                name: shortlist?.data?.name,
                education: shortlist?.data?.education,
                star: shortlist?.data?.birthstar,
                raashi: shortlist?.data?.raashi,
                gothra: shortlist?.data?.gothra,
                dob: shortlist?.data?.birthdate,
                dp: shortlist?.data?.profilepic,
            });

        //adding a array in viewingprofile (shortlisted me array)
        db.collection("users")
            .doc(shortlist.data.email)
            .set(
                {
                    shortlistedme:
                        firebase.firestore.FieldValue.arrayUnion(
                            loggedinuserEmail
                        ),
                },
                { merge: true }
            );

        // adding the logged in  user snippet in viewingprofile(shortlisted me snippet)

        db.collection("users")
            .doc(shortlist.data.email)
            .collection("shortlistedme")
            .doc(loggedinuserEmail)
            .set({
                email: loggedinprofile.email,
                name: loggedinprofile.name,
                education: loggedinprofile.education,
                star: loggedinprofile.birthstar,
                raashi: loggedinprofile.raashi,
                gothra: loggedinprofile.gothra,
                dob: loggedinprofile.birthdate,
                dp: loggedinprofile.profilepic,
            })
            .then(() => {
                // console.log("Document successfully deleted!");
                setsnackbarmsg("Successfully added to shortlist");
                setsnackbartype("success");
                setopenSnackbar(true);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    };

    return (
        <Grid container spacing={3}>
            {profiles.map(
                (profile, index) => (
                    console
                        .log
                        // getAge(
                        //     new Intl.DateTimeFormat("en-US", {
                        //         year: "numeric",
                        //         month: "2-digit",
                        //         day: "2-digit",
                        //     }).format(profile.data.birthdate)
                        // )
                        // new Date(
                        //     profile.data.birthdate._seconds * 1000
                        // ).toLocaleDateString("en-US")
                        (),
                    (
                        <Grid item xs={12} sm={4} lg={3}>
                            {console.log(profile.data.birthdate)}
                            <Card className={classes.root}>
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            aria-label={profile.data.name}
                                            className={classes.avatar}
                                        >
                                            {profile.data.name.charAt(0)}
                                        </Avatar>
                                    }
                                    action={
                                        <IconButton aria-label="settings">
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                    title={profile.data.name}
                                    subheader={profile.data.residingcity}
                                />
                                <CardMedia
                                    className={classes.media}
                                    image={profile.data.profilepic}
                                    title={profile.data.name}
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
                                                            getAge(
                                                                profile.data
                                                                    ?.birthdate
                                                            )
                                                        ),
                                                        getAge(
                                                            profile.data
                                                                ?.birthdate
                                                        ))
                                                    }{" "}
                                                    Years
                                                </span>
                                            </div>
                                            <div className="mat__profiles-height">
                                                <span>Height:</span>{" "}
                                                <span>
                                                    {profile.data.height}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mat__profiles-nakshatra">
                                            <span>Nakshatra:</span>
                                            <span>
                                                {profile.data.birthstar}
                                            </span>
                                        </div>
                                        <div className="mat__profiles-nakshatra">
                                            <span>Raashi:</span>
                                            <span>{profile.data.raashi}</span>
                                        </div>
                                        <div className={classes.education}>
                                            <span>Education:</span>
                                            <span>
                                                {
                                                    /\(([^)]+)\)/.exec(
                                                        profile.data.education
                                                    )[1]
                                                }
                                            </span>
                                            <Tooltip
                                                title={profile.data.education.replace(
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
                                    profile.data.birthdate._seconds * 1000
                                ).toLocaleDateString("en-US")} */}
                                    </Typography>
                                    <Button
                                        size="small"
                                        color="primary"
                                        className={classes.viewButton}
                                        onClick={() =>
                                            gotoProfile(profile.data.email)
                                        }
                                    >
                                        View Profile
                                    </Button>
                                </CardContent>
                                {/* <CardActions disableSpacing>
                                    {user.userData?.favorites?.indexOf(
                                        profile.data.email
                                    ) > -1 ? (
                                        <Tooltip title="Shortlisted">
                                            <IconButton title="Shortlisted">
                                                <BookmarkIcon />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Shortlist">
                                            <IconButton title="Shortlist">
                                                <BookmarkBorderIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    <IconButton aria-label="share">
                                        <ShareIcon />
                                    </IconButton>
                                    <IconButton
                                        className={clsx(classes.expand, {
                                            [classes.expandOpen]: expanded,
                                        })}
                                        onClick={handleExpandClick}
                                        aria-expanded={expanded}
                                        aria-label="show more"
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>
                                </CardActions> */}
                                <CardActions
                                    disableSpacing
                                    className={classes.cardfooter}
                                >
                                    {loggedinprofile?.shortlisted?.indexOf(
                                        profile.data.email
                                    ) > -1 ? (
                                        <Button
                                            title="Shortlisted"
                                            startIcon={<BookmarkIcon />}
                                            size="small"
                                            className={classes.sendshortbuttons}
                                            variant="outlined"
                                            onClick={(e) =>
                                                removeshortlist(
                                                    profile.data.email
                                                )
                                            }
                                            color="primary"
                                        >
                                            Shortlisted
                                        </Button>
                                    ) : (
                                        <Button
                                            title="Shortlisted"
                                            startIcon={<BookmarkBorderIcon />}
                                            size="small"
                                            className={classes.sendshortbuttons}
                                            variant="outlined"
                                            onClick={(e) =>
                                                shortlistrr([profile], e)
                                            }
                                            color="primary"
                                        >
                                            Shortlist
                                        </Button>
                                    )}
                                    {loggedinprofile?.interestssent?.indexOf(
                                        profile.data.email
                                    ) > -1 ? (
                                        <Button
                                            title="Shortlisted"
                                            startIcon={<BookmarkIcon />}
                                            size="small"
                                            className={classes.sendshortbuttons}
                                            variant="outlined"
                                        >
                                            SENT INTEREST
                                        </Button>
                                    ) : (
                                        <Button
                                            title="Shortlisted"
                                            startIcon={<BookmarkBorderIcon />}
                                            size="small"
                                            className={classes.sendshortbuttons}
                                            variant="outlined"
                                            onClick={() =>
                                                sendInterest(profile)
                                            }
                                        >
                                            SEND INTEREST
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    )
                )
            )}
        </Grid>
    );
}
