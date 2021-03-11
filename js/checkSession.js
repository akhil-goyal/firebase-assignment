// //This function will redirect user to dashboard if already authenticated
// function redirectIfLoggedIn() {
//     firebase.auth().onAuthStateChanged(function (user) {
//         if (user) {
            
//             // using timeout to allow addUser function to enter user info in firestore before redirect
//             setTimeout(function(){ 
//                 window.location = "dashboard.html";
//              }, 200); 

//         }
//     });
// }

// // This function will redirect user to dashboard if already authenticated
// function redirectIfNotLoggedIn() {
//     firebase.auth().onAuthStateChanged(function (user) {

//         if (!user) {
//             window.location = "login.html";
//         }
//     });
// }
