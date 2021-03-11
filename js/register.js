document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById("register-form");
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const uploadPhoto = document.getElementById("profile-image-upload");

    let file = "";
    let fileName = "";
    let fileExt = "";

    const db = firebase.firestore();

    uploadPhoto.addEventListener("change", (e) => {
        file = e.target.files[0];
        fileName = file.name.split(".").shift();
        fileExt = file.name.split(".").pop();
    });

    form.addEventListener('submit', (event) => {

        event.preventDefault();

        if (email.value
            && fullName.value
            && password.value) {

            firebase
                .auth()
                .createUserWithEmailAndPassword(email.value, password.value)
                .then(() => {

                    const user = firebase.auth().currentUser;

                    const storageRef = firebase.storage().ref(`images/${user.uid}.${fileExt}`);
                    const uploadTask = storageRef.put(file);

                    uploadTask.on(
                        "state_changed",
                        function () { },
                        function (error) {
                            console.log(error);
                        },
                        function () {
                            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                addUser(user.uid, email.value, fullName.value, downloadURL);
                            });
                        }
                    );

                })
                .catch((err) => console.log("err", err));

        }

    });

    function addUser(uid, email, name, url) {

        db.collection("Users")
            .doc(uid)
            .set({
                full_name: name,
                user_id: uid,
                email_address: email,
                profile_image: url,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
                window.location = "dashboard.html";
            })
            .catch((err) => console.log("err", err));
    }

});