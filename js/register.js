document.addEventListener("DOMContentLoaded", function () {
    
    const db = firebase.firestore();
    const form = document.querySelector(".register-form");
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
    
        if (fullName.value && email.value && password.value) {
            firebase
            .auth()
            .createUserWithEmailAndPassword(email.value, password.value)
            .then(function (data) {
              const user = firebase.auth().currentUser;
              addUser(user.uid, fullName.value);
            })
            .catch((error) => console.log("error", error));
        }
    });

    function addUser(userId, fullName) {
        db.collection("Users")
            .doc(userId)
            .set({
                full_name: fullName,
                user_id: userId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(function () {
                window.location = "dashboard.html";
            })
            .catch(function (error) {
                console.log("Error adding document", error);
            });      
    }

    

});