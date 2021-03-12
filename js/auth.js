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

// logout user from the site
function logout() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            console.log('Local storage cleared.');
        });

    window.location = "login.html";
}