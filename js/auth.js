document.addEventListener("DOMContentLoaded", function () {

    // get all elements
    const db = firebase.firestore();
    const loginForm = document.getElementById("login-form");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    // if it is login page then validate user on submit
    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            firebase
                .auth()
                .signInWithEmailAndPassword(email.value, password.value)
                .then(function () {

                    const user = firebase.auth().currentUser;

                    if (user) {

                        db.collection("Users")
                            .doc(user.uid)
                            .get()
                            .then(function (doc) {
                                if (doc.exists) {

                                    const userData = {
                                        userName: doc.data().full_name,
                                        userImage: doc.data().profile_image
                                    }

                                    localStorage.setItem('userData', JSON.stringify(userData));

                                    window.location = "dashboard.html";

                                } else {
                                    console.log("No such document");
                                }
                            });
                    }

                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    // display error
                    document.querySelector(".error").innerHTML = errorMessage;
                    document.querySelector(".error").style.display = 'block';

                });

        });
    }

});

// login with facebook
function facebookLogin() {

    event.preventDefault();

    // get facebook auth provider
    var provider = new firebase.auth.FacebookAuthProvider();

    // do auth using provider
    firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // The signed-in user info.
            var user = result.user;

            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var accessToken = credential.accessToken;

            window.location = "dashboard.html";
        })
        .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;

            // display error
            document.querySelector(".error").innerHTML = errorMessage;
            document.querySelector(".error").style.display = 'block';
        });
}

// login with google
function googleLogin() {

    event.preventDefault();

    // get google auth provider
    var provider = new firebase.auth.GoogleAuthProvider();

    // do auth using provider
    firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            window.location = "dashboard.html";

        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;

            // display error
            document.querySelector(".error").innerHTML = errorMessage;
            document.querySelector(".error").style.display = 'block';
        });
}

// logout user from the site
function logout() {

    event.preventDefault();

    firebase.auth().signOut().then(() => {

        localStorage.clear();

        // redirect to login page
        window.location = "login.html";

    }).catch((error) => {

        console.log(error.message);

    });
}