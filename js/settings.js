let userRef = null;
const loaderMain = document.getElementById(`loader-main`)
const profileMsg = document.getElementById(`profileMessage`)

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
            showProfileMessage(`Password updated successfully!`, `success`)
        }).catch((error) => {
            showProfileMessage(`An error occured while updating password : ${error}`, `error`)
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

    function showProfileMessage(data, flag) {
        profileMsg.innerHTML = `<b>${data}</b>`
        profileMsg.classList.add(flag)
        setTimeout(() => {
            clearProfileMessage()
        }, 3000);
    }

    function clearProfileMessage() {
        profileMsg.innerHTML = ``
        profileMsg.classList.remove(`success`)
        profileMsg.classList.remove(`error`)
    }

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