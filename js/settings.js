let userRef = null;

document.addEventListener('DOMContentLoaded', () => {

    const fullName = document.getElementById("settings-fullname");
    const email = document.getElementById("settings-email");
    const password = document.getElementById("settings-password");
    const profilePicture = document.getElementById('profile-image');
    const updatePicture = document.getElementById("settings-picture");
    const buttonUpdate = document.getElementById("update");

    const db = firebase.firestore();

    function updateUser(uid, fullname, picture, newpassword) {

        // Update Password
        var user = firebase.auth().currentUser;

        user.updatePassword(newpassword).then(() => {
            console.log('Password updated successfully!');
        }).catch((error) => {
            console.log(`An error occured while updating password : ${error}`);
        });

        // Update user data
        db.collection("Users").doc(uid).update({
            full_name: fullname,
            profile_image: picture,
        });
    }

    buttonUpdate.addEventListener("click", function () {
        updateUser(userRef.uid, fullName.value, updatePicture.value, password.value);
    });

    function getUser(uid) {
        db.collection("Users")
            .doc(uid)
            .get()
            .then(function (doc) {
                if (doc.exists) {
                    fullName.value = doc.data().full_name;
                    email.value = doc.data().email_address;
                    password.value = "***********";
                    profilePicture.src = doc.data().profile_image;
                } else {
                    console.log("No such document");
                }
            });
    }

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            userRef = user;
            getUser(user.uid);
        } else {
        }
    });

});