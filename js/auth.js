document.addEventListener("DOMContentLoaded", function () {

    const db = firebase.firestore();
    const loginForm = document.getElementById("login-form");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    if(loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
        
            firebase
            .auth()
            .signInWithEmailAndPassword(email.value, password.value)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                
                window.location = "dashboard.html";
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage);
            });
        });
    }

});

function facebookLogin() {

    event.preventDefault();
    var provider = new firebase.auth.FacebookAuthProvider();

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

        console.log(error);
        // ...
    });
}

function googleLogin() {

    event.preventDefault();
    var provider = new firebase.auth.GoogleAuthProvider();

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

        console.log(error);
        // ...
    });
}

function logout() {

    event.preventDefault();

    firebase.auth().signOut().then(() => {

        window.location = "login.html";

    }).catch((error) => {

        console.log(error.message);

    });
}