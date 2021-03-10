document.addEventListener("DOMContentLoaded", function () {

    // get all elements
    const db = firebase.firestore();
    const form = document.getElementById("register-form");
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const uploadPhoto = document.getElementById("profile-image-upload");

    // create global file var
    let file = "";
    let fileName = "";
    let fileExt = "";

    // to get file info when image changed
    uploadPhoto.addEventListener("change", function (event) {
        file = event.target.files[0];
        fileName = file.name.split(".").shift();
        fileExt = file.name.split(".").pop();

    });

    // when registration form is submitted
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        // create var to save filename in storage
        let uploadedFileName = '';

        // if file is uploaded 
        if (fileName) {

            // get unique image id
            const imageId = db.collection("Images").doc().id;

            // create file name using id and ext
            uploadedFileName = `${imageId}.${fileExt}`;

            // get image ref from storage
            const storageRef = firebase.storage().ref(`images/${uploadedFileName}`);

            // upload image
            storageRef.put(file);
        }

        // if all mandatory info provided 
        if (fullName.value && email.value && password.value) {

            // create user using email password auth
            firebase
                .auth()
                .createUserWithEmailAndPassword(email.value, password.value)
                .then(function (data) {

                    // get user object
                    const user = firebase.auth().currentUser;

                    // add user in firesore
                    addUser(user.uid, fullName.value, email.value, uploadedFileName);

                    const userData = {
                        userName: fullName.value,
                        userImage: uploadedFileName
                    }

                    localStorage.setItem('userData', JSON.stringify(userData));
                })
                .catch((error) => console.log("error", error));
        }
    });

    // func to add user in firestore 
    function addUser(userId, fullName, email, uploadedFileName) {

        // create user doc using user id provided by auth
        db.collection("Users")
            .doc(userId)
            .set({
                full_name: fullName,
                user_id: userId,
                email_address: email,
                profile_image: uploadedFileName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(function () {

                // redirect to dashboard
                window.location = "dashboard.html";
            })
            .catch(function (error) {
                console.log("Error adding document", error);
            });
    }

});