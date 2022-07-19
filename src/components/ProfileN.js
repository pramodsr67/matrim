import {
    Box,
    Button,
    Paper,
    Snackbar,
    SnackbarContent,
    Typography,
} from "@material-ui/core";
import { Grid, makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../app/firebase";
import Profileimagegallery from "./Profileimagegallery";
import moment from "moment";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import "./Profile.scss";
import { Card } from "@material-ui/core";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import firebase from "firebase";
import { batch } from "react-redux";
import MuiAlert from "@material-ui/lab/Alert";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import Profilepartnerpreference from "./Profilepartnerpreference";
import { Skeleton } from "@material-ui/lab";
import WithLoading from "./Withloading.js";
const ListWithLoading = WithLoading(Profilepartnerpreference);

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: "100%",
    },
    imageGallery: {
        position: "sticky",
        top: "0",
        "& .image-gallery-thumbnail": {
            "& .image-gallery-thumbnail-image": {
                height: "100px",
                objectFit: "cover",
            },
        },
    },
    actionButtons: {
        width: "250px",
        margin: "10px",
        "@media (max-width: 767px)": {
            margin: "10px 5px",
        },
    },
    actionButtonsHolder: {
        display: "flex",
        justifyContent: "center",
        "@media (max-width: 767px)": {
            // flexDirection: "column",
            alignItems: "center",
            button: {
                padding: "8px",
            },
        },
    },
    actions__msg: {
        display: "flex",
        flexDirection: "column",
    },
    subheading: {
        // background: theme.palette.primary.main,
        // padding: "10px",
        // borderRadius: "10px",
    },
    listgroup: {
        overflow: "hidden",
        padding: "10px",
        paddingBottom: "0",
        margin: "10px 0",
    },
    listdesc: {
        listStyle: "none",
        paddingLeft: "10px",
        width: "100%",
    },
    listdescli: {
        marginBottom: "10px",
        width: "100%",
        "@media (max-width: 767px)": {
            display: "flex",
        },
    },
    leftSideHead: {
        width: "175px",
        display: "block",
        float: "left",
        textTransform: "uppercase",
        position: "relative",
        "@media (max-width: 767px)": {
            width: "140px",
            "&::after": {
                content: '":"',
                right: "0",
                position: "absolute",
                top: "-1px",
            },
        },
    },

    rightSidedesc: {
        fontSize: "1rem",
        width: "calc(100% - 175px)",
        wordBreak: "break-word",
        "@media (max-width: 767px)": {
            width: "calc(100% - 140px)",
            paddingLeft: "5px",
        },
    },
    requestsection: {
        justifyContent: "center",
        maxWidth: "500px",
        margin: " 0 auto",
        display: "flex",
    },
    requestsectioninner: {
        display: "flex",
        alignItems: "center",
        alignContent: "flex-start",
    },
    requestmsgholder: {
        display: "flex",
        flexDirection: "column",
        maxWidth: "500px",
        margin: "0 auto",
    },
    requestmsg: {
        display: "inline",
        padding: "10px 30px",

        float: "left",
        textAlign: "center",
        maxWidth: "500px",
        margin: "10px auto",
        "@media (max-width: 767px)": {
            padding: "10px",
        },
    },
    profile__picholder: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    profile__pic: {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        objectFit: "cover",
    },
    profile__preferencesul: {
        paddingLeft: 0,
    },
    profile__preferencesli: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 5px",
        fontSize: "16px",
        borderBottomColor: theme.palette.primary.main,
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
    },
    profile__match: {
        display: "flex",
        alignItems: "center",
    },
    acceptdecline: {
        margin: "0 5px",
    },
}));
function Profile() {
    const classes = useStyles();

    const location = useLocation();

    const myparam = location.state.params;
    const userid = myparam.uid;

    const [profilee, setprofilee] = useState([]);

    const [loadingpartnerPref, setLoadingpartnerPref] = useState(true);
    // useEffect(() => {
    //     db.collection("users")
    //         .where("uid", "==", userid)
    //         .get()
    //         .then(function (querySnapshot) {
    //             querySnapshot.forEach(function (doc) {
    //                 // doc.data() is never undefined for query doc snapshots
    //                 console.log(doc.id, " => ", doc.data());
    //                 setprofilee(doc.data());
    //             });
    //         })
    //         .catch(function (error) {
    //             console.log("Error getting documents: ", error);
    //         });
    // }, []);
    // const [profilee, setprofilee] = useState([]);
    // const getAge = (dateString) => {
    //     // getAge(dateString) {
    //     var today = new Date();
    //     var birthDate = new Date(dateString);
    //     var age = today.getFullYear() - birthDate.getFullYear();
    //     var m = today.getMonth() - birthDate.getMonth();
    //     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    //         age--;
    //     }
    //     return age;
    // };

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
    // const [profileeready, setProfileeready] = useState(false);
    // const [loggedusersready, setloggedusersready] = useState(false);
    const useUsers = () => {
        // 1
        // const [users, usersSet] = React.useState([]);
        // const [newProfileImages, setnewProfileImages] = useState();

        useEffect(() => {
            function fetchImages() {
                // const fullResponse = await fetch("https://reqres.in/api/users");
                // const responseJson = await fullResponse.json();
                // usersSet(responseJson.data);
                setLoadingpartnerPref(true);
                db.collection("users")
                    .doc(userid)
                    .get()
                    .then((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());

                        setprofilee(doc.data());
                        setLoadingpartnerPref(false);
                        // console.log(profilee);
                        // if (profilee.length) setProfileeready(true);
                    })

                    .catch(function (error) {
                        console.log("Error getting documents: ", error);
                    });
            }

            fetchImages();
        }, []);

        // 2
        return [profilee];
    };

    const [profiles] = useUsers();
    console.log(profiles);

    // console.log(profileimage);
    // console.log(pic1);
    // console.log(pic2);

    // const useUsers1 = () => {
    //     // 1
    //     // const [users, usersSet] = React.useState([]);
    //     // const [newProfileImages, setnewProfileImages] = useState();

    //     const [profileimage, setprofileimage] = useState();
    //     const [pic1, setpic1] = useState();
    //     const [pic2, setpic2] = useState();
    //     React.useEffect(() => {
    //         async function fetchImages() {
    //             // const fullResponse = await fetch("https://reqres.in/api/users");
    //             // const responseJson = await fullResponse.json();
    //             // usersSet(responseJson.data);
    //             console.log(profiles);
    //             setprofileimage(profiles.profilepic ? profiles.profilepic : "");
    //             setpic1(profiles.pic1 ? profiles.pic1 : "");
    //             setpic2(profiles.pic2 ? profiles.pic2 : "");
    //         }

    //         fetchImages();
    //     }, []);

    //     // 2
    //     return [profileimage, pic1, pic2];
    // };

    // const [profileimage, pic1, pic2] = useUsers1();
    const [profileimage, setprofileimage] = useState();
    const [pic1, setpic1] = useState();
    const [pic2, setpic2] = useState();
    useEffect(() => {
        console.log(profilee); // do something after state has updated
        console.log(profilee.profilepic);
        console.log(profilee.birthdate);
        setprofileimage(profilee.profilepic ? profilee.profilepic : "");
        setpic1(profilee.pic1 ? profilee.pic1 : "");
        setpic2(profilee.pic2 ? profilee.pic2 : "");
        // setProfileeready(true);
        console.log(Object.keys(profilee).length + " profileeeeeeeee length");
    }, [profilee]);
    useEffect(() => {
        console.log(profileimage);
        console.log(pic1);
        console.log(pic2);
    }, [profileimage, pic1, pic2]);

    console.log(profilee.birthdate);
    const d = new Date(profilee.birthdate);
    let date = d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString();
    console.log(d);

    const [profileimages, setprofileimages] = useState([]);
    // useEffect(() => {
    //     if (!profileimages) {
    //         // setprofileimages("");
    //         setprofileimages((state) => [...state, profileimage]);
    //         setprofileimages((state) => [...state, pic1]);
    //         setprofileimages((state) => [...state, pic2]);
    //         console.log(profileimages);
    //     }
    // }, [profileimages]);
    const images = [
        {
            original: profileimage,
            thumbnail: profileimage,
        },
        pic1 !== " "
            ? {
                  original: pic1,
                  thumbnail: pic1,
              }
            : " ",
        pic2 !== ""
            ? {
                  original: pic2,
                  thumbnail: pic2,
              }
            : "",
    ];
    // const timstamp =
    //     profilee &&
    //     profilee.bithdate &&
    //     profilee.birthdate.nanoseconds.toDate();
    // console.log(timstamp);
    // db.collection("users").doc(this.username).collection("booksList").add({
    //     password: this.password,
    //     name: this.name,
    //     rollno: this.rollno,
    // });
    const userDetails = useSelector(selectUser);
    const [loggedinUser, setloggedinUser] = useState(userDetails);

    useEffect(() => {
        setloggedinUser(userDetails);
    }, loggedinUser);
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;
    if (user != null) {
        email = user.email;
        uid = user.uid;
        // The user's ID, unique to the Firebase project. Do NOT use // this value to authenticate with your backend server, if // you have one. Use User.getToken() instead.}
    }
    console.log(uid);
    console.log(email);
    // db.collection("users")
    //     .doc(email)
    //     .get()
    //     .then(function (querySnapshot) {
    //         console.log(querySnapshot);
    //         querySnapshot(function (doc) {
    //             // doc.data() is never undefined for query doc snapshots
    //             console.log(doc.id, " => ", doc.data());
    //             setprofilee(doc.data());
    //         });
    //     })
    //     .catch(function (error) {
    //         console.log("Error getting documents: ", error);
    //     });
    const [loggedUsersData, setloggedUsersData] = useState([""]);
    const [iserror, setIserror] = useState(true);

    useEffect(() => {
        console.log(profilee);
        console.log("jsdkfdgslds kdjlfdfldfdgkld dfdkljfdsflsdfdslfdhf ");
        console.log("testtttttttttt");
        console.log(profilee.email);
        if (profilee?.email) loadNow();
    }, [profilee]);
    const loadNow = () => {
        db.collection("users")
            .doc(email)
            .collection("recentlyviewed")
            .doc(profilee?.email)
            .set({
                email: profilee?.email,
                name: profilee?.name,
                education: profilee?.education,
                star: profilee?.birthstar,
                raashi: profilee?.raashi,
                gothra: profilee?.gothra,
                dob: profilee?.birthdate,
                dp: profilee?.profilepic,
                viewedon: firebase.firestore.FieldValue.serverTimestamp(),
            });

        db.collection("users")
            .doc(profilee.email)
            .collection("recentlyviewedme")
            .doc(email)
            .set({
                email: loggedinUser.userData.email,
                name: loggedinUser.userData.name,
                education: loggedinUser.userData.education,
                star: loggedinUser.userData.birthstar,
                raashi: loggedinUser.userData.raashi,
                gothra: loggedinUser.userData.gothra,
                dob: loggedinUser.userData.birthdate,
                dp: loggedinUser.userData.profilepic,
                viewedon: firebase.firestore.FieldValue.serverTimestamp(),
            });
    };
    // useEffect(() => {
    //     console.log(profilee + "llllllllllllllllllllllllllll");
    //     alert("df");

    //     // db.collection("users")
    //     //     .doc(profilee.email)
    //     //     .collection("recentlyviewed")
    //     //     .doc(email)
    //     //     .set({
    //     //         email: loggedinUser.userData.email,
    //     //         name: loggedinUser.userData.name,
    //     //         education: loggedinUser.userData.education,
    //     //         star: loggedinUser.userData.birthstar,
    //     //         raashi: loggedinUser.userData.raashi,
    //     //         gothra: loggedinUser.userData.gothra,
    //     //         dob: loggedinUser.userData.birthdate,
    //     //         dp: loggedinUser.userData.profilepic,
    //     //     })
    //     //     .then(() => {
    //     //         // console.log("Document successfully deleted!");
    //     //         // setsnackbarmsg("Successfully added to shortlist");
    //     //         // setsnackbartype("success");
    //     //         // setopenSnackbar(true);
    //     //     })
    //     //     .catch((error) => {
    //     //         console.error("Error adding document: ", error);
    //     //     });
    // }, [profilee]);
    useEffect(() => {
        setLoadingpartnerPref(true);
        db.collection("users")
            .doc(email)
            .onSnapshot((doc) => {
                setloggedUsersData(doc.data());
                setLoadingpartnerPref(false);
            });
        // setloggedusersready(true);
        // }
    }, [email]);
    useEffect(() => {
        console.log(loggedUsersData);
    }, [loggedUsersData]);
    var userRef = db.collection("users").doc(email);
    const tobeshortlistedId = profilee.email;

    const shortlist = () => {
        //adding a array in logged in user(myshortlist(loggedin user) array)
        userRef.set(
            {
                shortlisted:
                    firebase.firestore.FieldValue.arrayUnion(tobeshortlistedId),
            },
            { merge: true }
        );

        // adding the shortlisted user snippet in logged in user(myshortlist(loggedin user) snippet)
        db.collection("users")
            .doc(email)
            .collection("shortlisted")
            .doc(profilee.email)
            .set({
                email: profilee.email,
                name: profilee.name,
                education: profilee.education,
                star: profilee.birthstar,
                raashi: profilee.raashi,
                gothra: profilee.gothra,
                dob: profilee.birthdate,
                dp: profilee.profilepic,
            });

        //adding a array in viewingprofile (shortlisted me array)
        db.collection("users")
            .doc(profilee.email)
            .set(
                {
                    shortlistedme:
                        firebase.firestore.FieldValue.arrayUnion(email),
                },
                { merge: true }
            );

        // adding the logged in  user snippet in viewingprofile(shortlisted me snippet)
        db.collection("users")
            .doc(profilee.email)
            .collection("shortlistedme")
            .doc(email)
            .set({
                email: loggedinUser.userData.email,
                name: loggedinUser.userData.name,
                education: loggedinUser.userData.education,
                star: loggedinUser.userData.birthstar,
                raashi: loggedinUser.userData.raashi,
                gothra: loggedinUser.userData.gothra,
                dob: loggedinUser.userData.birthdate,
                dp: loggedinUser.userData.profilepic,
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

    const removeshortlist = () => {
        userRef.set(
            {
                shortlisted:
                    firebase.firestore.FieldValue.arrayRemove(
                        tobeshortlistedId
                    ),
            },
            { merge: true }
        );
        db.collection("users")
            .doc(email)
            .collection("shortlisted")
            .doc(profilee.email)
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
            .doc(profilee.email)
            .set(
                {
                    shortlistedme:
                        firebase.firestore.FieldValue.arrayRemove(email),
                },
                { merge: true }
            );
        // removing the logged in  user snippet in viewingprofile
        db.collection("users")
            .doc(profilee.email)
            .collection("shortlistedme")
            .doc(email)
            .delete()
            .then(() => {
                console.log("Document successfully deleted!");
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
            });
    };

    const [openSnackbar, setopenSnackbar] = useState(false);
    const [snackbarmsg, setsnackbarmsg] = useState();
    const [snackbartype, setsnackbartype] = useState();

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setopenSnackbar(false);
    };

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const sendInterest = () => {
        //adding a array of in logged in user
        userRef.set(
            {
                interestssent:
                    firebase.firestore.FieldValue.arrayUnion(tobeshortlistedId),
            },
            { merge: true }
        );
        // adding the interested user snippet in logged in user(myintersets(loggedin user) snippet)
        db.collection("users")
            .doc(email)
            .collection("interestssent")
            .doc(profilee.email)
            .set({
                email: profilee.email,
                name: profilee.name,
                education: profilee.education,
                star: profilee.birthstar,
                raashi: profilee.raashi,
                gothra: profilee.gothra,
                dob: profilee.birthdate,
                dp: profilee.profilepic,
                accepted: false,
                read: false,
                sentDate: firebase.firestore.FieldValue.serverTimestamp(),
            });

        //adding a array in viewingprofile (shortlisted me array)
        db.collection("users")
            .doc(profilee.email)
            .set(
                {
                    interestsreceived:
                        firebase.firestore.FieldValue.arrayUnion(email),
                },
                { merge: true }
            );

        // adding the logged in  user snippet in viewingprofile(shortlisted me snippet)
        db.collection("users")
            .doc(profilee.email)
            .collection("interestsreceived")
            .doc(email)
            .set({
                email: loggedinUser.userData.email,
                name: loggedinUser.userData.name,
                education: loggedinUser.userData.education,
                star: loggedinUser.userData.birthstar,
                raashi: loggedinUser.userData.raashi,
                gothra: loggedinUser.userData.gothra,
                dob: loggedinUser.userData.birthdate,
                dp: loggedinUser.userData.profilepic,
                accepted: false,
                read: false,
                recievedDate: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
                // console.log("Document successfully deleted!");
                setsnackbarmsg(
                    `Successfully sent interest to ${profilee.name}`
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
    useEffect(() => {
        db.collection("users")
            .doc(email)
            .collection("interestssent")
            .doc(userid)
            .onSnapshot((doc) => {
                setinterestSent(doc.data());
            });

        // }
    }, []);

    useEffect(() => {
        // });
        db.collection("users")
            .doc(email)
            .collection("interestsreceived")
            .doc(userid)
            .onSnapshot(
                (doc) => {
                    // console.log(doc.data());
                    setinterestReceived(doc.data());
                },
                (error) => {
                    console.log(error);
                }
            );

        // }
        console.log(email);
    }, []);

    const acceptRequest = (requestEmail) => {
        db.collection("users")
            .doc(email)
            .collection("interestsreceived")
            .doc(requestEmail)
            .set(
                {
                    accepted: true,
                    read: true,
                },
                { merge: true }
            );
        db.collection("users")
            .doc(requestEmail)
            .collection("interestssent")
            .doc(email)
            .set(
                {
                    accepted: "accepted",
                },
                { merge: true }
            );
    };

    const declineRequest = (requestEmail) => {
        db.collection("users")
            .doc(email)
            .collection("interestsreceived")
            .doc(requestEmail)
            .set(
                {
                    accepted: false,
                    read: true,
                },
                { merge: true }
            );
        db.collection("users")
            .doc(requestEmail)
            .collection("interestssent")
            .doc(email)
            .set(
                {
                    accepted: "declined",
                },
                { merge: true }
            );
    };
    // function CircularProgressWithLabel(props) {
    //     return (
    //         <Box position="relative" display="inline-flex">
    //             <CircularProgress variant="determinate" {...props} />
    //             <Box
    //                 top={0}
    //                 left={0}
    //                 bottom={0}
    //                 right={0}
    //                 position="absolute"
    //                 display="flex"
    //                 alignItems="center"
    //                 justifyContent="center"
    //             >
    //                 <Typography
    //                     variant="caption"
    //                     component="div"
    //                     color="textSecondary"
    //                 >{`${Math.round(props.value)}%`}</Typography>
    //             </Box>
    //         </Box>
    //     );
    // }
    // CircularProgressWithLabel.propTypes = {
    //     /**
    //      * The value of the progress indicator for the determinate variant.
    //      * Value between 0 and 100.
    //      * @default 0
    //      */
    //     value: PropTypes.number.isRequired,
    // };

    // const [progress, setProgress] = React.useState(70);

    // // React.useEffect(() => {
    // const timer = setInterval(() => {
    //     setProgress((prevProgress) =>
    //         prevProgress >= progress ? 0 : prevProgress + 10
    //     );
    // }, 100);
    // //return () => {
    // if (progress >= 80) {
    //     clearInterval(timer);
    // }

    // // };
    // }, []);

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <div className={classes.imageGallery}>
                        <Profileimagegallery user={userid} images={images} />
                        <div className={classes.actionButtonsHolder}>
                            <Snackbar
                                open={openSnackbar}
                                autoHideDuration={3000}
                                onClose={handleClose}
                            >
                                <Alert
                                    onClose={handleClose}
                                    severity={snackbartype}
                                >
                                    {snackbarmsg}
                                </Alert>
                            </Snackbar>
                            {loggedUsersData?.shortlisted?.indexOf(
                                profilee.email
                            ) > -1 ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    className={classes.actionButtons}
                                    endIcon={<BookmarkIcon>send</BookmarkIcon>}
                                    onClick={removeshortlist}
                                >
                                    Shortlisted
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    className={classes.actionButtons}
                                    endIcon={
                                        <BookmarkBorderIcon>
                                            send
                                        </BookmarkBorderIcon>
                                    }
                                    onClick={shortlist}
                                >
                                    Shortlist
                                </Button>
                            )}
                            {loggedUsersData?.interestssent?.indexOf(
                                profilee.email
                            ) > -1 ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    className={classes.actionButtons}
                                    onClick={sendInterest}
                                    endIcon={<FavoriteIcon>send</FavoriteIcon>}
                                >
                                    Interest Sent
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    className={classes.actionButtons}
                                    onClick={sendInterest}
                                    endIcon={
                                        <FavoriteBorderIcon>
                                            send
                                        </FavoriteBorderIcon>
                                    }
                                >
                                    Send Interest
                                </Button>
                            )}
                        </div>
                        {/* <div className={classes.actionButtonsHolder}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                className={classes.actionButtons}
                                endIcon={
                                    <PhoneIphoneIcon>send</PhoneIphoneIcon>
                                }
                            >
                                View Contact
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                className={classes.actionButtons}
                                endIcon={
                                    <ChatBubbleOutlineIcon>
                                        send
                                    </ChatBubbleOutlineIcon>
                                }
                            >
                                Send Message
                            </Button>
                        </div> */}

                        <div className={classes.actions__msg}>
                            {loggedUsersData?.interestsreceived?.indexOf(
                                profilee.email
                            ) > -1 ? (
                                <Paper className={classes.requestmsg}>
                                    <div className={classes.requestsection}>
                                        {!interestReceived?.accepted ? (
                                            <div
                                                className={
                                                    classes.requestsectioninner
                                                }
                                            >
                                                <span>
                                                    {interestReceived?.name} is
                                                    awaiting for response
                                                </span>
                                                <Button
                                                    color="primary"
                                                    variant="contained"
                                                    className={
                                                        classes.acceptdecline
                                                    }
                                                    onClick={(e) =>
                                                        acceptRequest(
                                                            profilee.email
                                                        )
                                                    }
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    color="primary"
                                                    variant="outlined"
                                                    className={
                                                        classes.acceptdecline
                                                    }
                                                    onClick={(e) =>
                                                        declineRequest(
                                                            profilee.email
                                                        )
                                                    }
                                                >
                                                    <strong>Decline</strong>
                                                </Button>
                                            </div>
                                        ) : (
                                            <div
                                                className={
                                                    classes.requestmsgholder
                                                }
                                            >
                                                <Paper
                                                    className={
                                                        classes.requestmsg
                                                    }
                                                >
                                                    You have
                                                    {interestReceived?.accepted
                                                        ? " accepted"
                                                        : " declined"}{" "}
                                                    <strong>
                                                        {interestReceived?.name}
                                                        's{" "}
                                                    </strong>
                                                    request
                                                </Paper>
                                            </div>
                                        )}
                                    </div>
                                </Paper>
                            ) : (
                                <div></div>
                            )}

                            <div className={classes.requestmsgholder}>
                                <Paper className={classes.requestmsg}>
                                    {loggedUsersData?.interestssent?.indexOf(
                                        profilee.email
                                    ) > -1 ? (
                                        <>
                                            {!interestSent?.accepted ? (
                                                <div>
                                                    Awaiting response from{" "}
                                                    {interestSent?.name} for
                                                    your request
                                                </div>
                                            ) : (
                                                <div>
                                                    {loggedUsersData?.interestsreceived?.indexOf(
                                                        profilee.email
                                                    ) > -1 &&
                                                    loggedUsersData?.interestssent?.indexOf(
                                                        profilee.email
                                                    ) > -1 ? (
                                                        <>
                                                            & <br />
                                                        </>
                                                    ) : (
                                                        ""
                                                    )}{" "}
                                                    {/* &<br></br> */}
                                                    <strong> Akshara </strong>
                                                    has
                                                    {interestSent?.accepted ===
                                                    "accepted"
                                                        ? " accepted"
                                                        : " declined"}{" "}
                                                    <strong>Your </strong>
                                                    request
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div></div>
                                    )}
                                </Paper>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h3">
                        Profile of {profilee.name}
                    </Typography>

                    <Card className={classes.listgroup}>
                        <Typography variant="h5" className={classes.subheading}>
                            Basic Details
                        </Typography>
                        {console.log()}
                        <ul className={classes.listdesc}>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>NAME</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.name}
                                </span>
                            </li>{" "}
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>AGE</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {/* {getAge(profilee.birthdate)} Years */}
                                    {moment(
                                        profilee.birthdate?.toDate(),
                                        "YYYYMMDD"
                                    )
                                        .fromNow()
                                        .replace("ago", "")}
                                </span>
                            </li>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>HEIGHT</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.height}
                                </span>
                            </li>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Profile Created by</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.createdby}
                                </span>
                            </li>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Current Location</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.residingcity},
                                    {profilee.residingstate},
                                    {profilee.residingcountry}
                                </span>
                            </li>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Marital Status</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.maritalstatus}
                                </span>
                            </li>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Mother Tongue</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.mothertongue}
                                </span>
                            </li>
                        </ul>
                    </Card>

                    <Card className={classes.listgroup}>
                        <Typography variant="h5">
                            Religion & Horoscope Details
                        </Typography>

                        <ul className={classes.listdesc}>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Caste</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.caste}
                                </span>
                            </li>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Sub Caste/Matha</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.subcaste}
                                </span>
                            </li>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Gothra</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.gothra}
                                </span>
                            </li>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Raashi</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.raashi}
                                </span>
                            </li>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Nakshatra</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.birthstar}
                                </span>
                            </li>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Date of Birth</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {moment(
                                        profilee.birthdate?.toDate()
                                    ).format("ll")}
                                </span>
                            </li>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Place of Birth</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.birthcity},{profilee.birthstate},
                                    {profilee.birthcountry}
                                </span>
                            </li>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Time of Birth</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {/* {new Intl.DateTimeFormat("en-US", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    }).format(
                                        profilee.birthtime?.toDate().getTime()
                                    )} */}
                                    {new Date(
                                        profilee.birthtime?.toDate().getTime()
                                    ).toLocaleTimeString()}
                                </span>
                            </li>
                        </ul>
                    </Card>

                    <Card className={classes.listgroup}>
                        <Typography variant="h5">
                            Professional Details
                        </Typography>

                        <ul className={classes.listdesc}>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Highest Education</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.education}
                                </span>
                            </li>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Employment</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.employment}
                                </span>
                            </li>
                            {profilee.employment !== "Not Working" ? (
                                <>
                                    <li className={classes.listdescli}>
                                        <span className={classes.leftSideHead}>
                                            <strong>Company Name</strong>
                                        </span>
                                        <span className={classes.rightSidedesc}>
                                            {profilee.companyname}
                                        </span>
                                    </li>
                                    <li className={classes.listdescli}>
                                        <span className={classes.leftSideHead}>
                                            <strong>Job nature</strong>
                                        </span>
                                        <span className={classes.rightSidedesc}>
                                            {profilee.jobnature}
                                        </span>
                                    </li>
                                    <li className={classes.listdescli}>
                                        <span className={classes.leftSideHead}>
                                            <strong>Annual Income</strong>
                                        </span>
                                        <span className={classes.rightSidedesc}>
                                            {profilee.income}{" "}
                                            {profilee.Currency?.symbol}{" "}
                                            {profilee.Currency?.cc}
                                        </span>
                                    </li>
                                </>
                            ) : (
                                ""
                            )}
                        </ul>
                    </Card>
                    <Card className={classes.listgroup}>
                        <Typography variant="h5">Family Details</Typography>
                        <ul className={classes.listdesc}>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Family Values</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.familyvalues}
                                </span>
                            </li>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Family Type</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.familytype}
                                </span>
                            </li>
                            <li className={classes.listdescli}>
                                <span className={classes.leftSideHead}>
                                    <strong>Family Status</strong>
                                </span>
                                <span className={classes.rightSidedesc}>
                                    {profilee.familystatus}
                                </span>
                            </li>
                        </ul>
                    </Card>

                    <Card className={classes.listgroup}>
                        <Typography variant="h5">
                            Partner Preferences
                        </Typography>

                        <ListWithLoading
                            isLoading={loadingpartnerPref}
                            loggedUsersData={loggedUsersData}
                            profilee={profilee}
                        />
                        {/* {Object.keys(loggedUsersData).length &&
                        Object.keys(profilee).length ? (
                            <Profilepartnerpreference
                                loggedUsersData={loggedUsersData}
                                profilee={profilee}
                            />
                        ) : (
                            <div className={classes.root}>
                                <Skeleton />
                                <Skeleton animation={false} />
                                <Skeleton animation="wave" />
                            </div>
                        )} */}
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default Profile;
