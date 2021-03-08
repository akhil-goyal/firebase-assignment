function redirectIfLoggedIn() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            window.location = "dashboard.html";
        }
    });
}

function redirectIfNotLoggedIn() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            window.location = "login.html";
        }
    });
}
