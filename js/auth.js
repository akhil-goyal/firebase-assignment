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

        console.log(result);

        // if this is new user
        if(result.additionalUserInfo.isNewUser) {
            addUser(user.uid, user.displayName);
        }
        
        // call adduser func

        // ...
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

        console.log(result);
        // ...
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