document.addEventListener('DOMContentLoaded', () => {

    // const actualBtn = document.getElementById('actual-btn');
    // const fileChosen = document.getElementById('uploaded-files');
    const userName = document.querySelector('.user-name');
    const userImage = document.querySelector('#profile-image1');

    let threadContainer = document.querySelector('.thread-list');
    let threadDate = document.querySelector('.time-bar');
    let threadTitle = document.querySelector('.thread-title-dashboard');
    let threadDesc = document.querySelector('.thread-desc-dashboard');
    let threadAuthor = document.querySelector('.name-bar');
    let authorAvatar = document.querySelector('.thread-image');

    let attachmentImage = document.querySelector('.image-attachment');

    const db = firebase.firestore();

    const user = JSON.parse(localStorage.getItem('userData'));

    console.log('DASHBOARD : ', user);

    userName.innerHTML = `Welcome, ${user.userName}`;

    const listRef = firebase.storage().ref("images");

    listRef
        .listAll()
        .then(function (res) {
            res.items.forEach(function (itemRef) {
                itemRef
                    .getDownloadURL()
                    .then(function (downloadURL) {
                        downloadURL.includes(user.userImage) ? userImage.src = downloadURL : ''
                    })
                    .catch((error) => console.log("error", error));
            });
        })
        .catch((error) => console.log("error", error));

    const spanElement = (elem) => {

        let span = document.createElement(`span`)
        span.classList.add(`div-uplaoded-doc`)
        span.setAttribute(`id`, `file-chosen`)


        let nested_span = document.createElement(`span`)
        nested_span.innerText = elem.name
        nested_span.classList.add(`file-name`)
        span.setAttribute(`title`, elem.name)

        let nested_i = document.createElement(`i`)
        nested_i.classList.add(`fas`)
        nested_i.classList.add(`fa-times`)


        span.appendChild(nested_span)
        span.appendChild(nested_i)

        return span;
    }


    db
        .collection("threads")
        .orderBy("timestamp", "asc")
        .onSnapshot((querySnapshot) => {

            threadContainer.innerHTML = ``;

            querySnapshot.forEach((doc) => {

                console.log('THREADS DOC : ', doc.data());

                threadContainer.innerHTML += `
                                            <div class="thread shadow">
                            
                                            <div class="flex">
                                                <img src="../resources/images/user_avatar.png" class="thread-image" width="20" alt="">
                                                <i class="fas fa-circle online-user"></i>
                                                <p class="name-bar"><b></b></p>
                                                <b class="time-bar text-right flex-auto">${doc.data().timestamp.toDate().toDateString()}</b>
                                            </div>
                            
                                            <div class="thread-content">
                            
                                                <div class="plain-content">
                                                    <p class="thread-title-dashboard"><b>${doc.data().thread_title}</b></p>
                                                    <p class="thread-desc-dashboard"><b>${doc.data().thread_description}</b></p>
                                                </div>

                                                <div class="thread-attachments">
                                                    <img class="image-attachment" src="../resources/images/user_avatar.png" alt="">
                                                </div>
                            
                                                <div class="add-comment">
                                                    <p>Add comment:</p>
                                                    <div class="flex comment-input">
                                                        <input type="text">
                                                        <button class="post-button">Post</button>
                                                    </div>
                                                </div>
                            
                                                <div>
                                                    <p class="text-right color-website"><b>4 Comments</b></p>
                                                </div>
                            
                                            </div>
                            
                                            <div class="thread-comments">
                            
                                                <div class="comment">
                                                    <div class="flex">
                                                        <p class="name-bar"><b>Akhil Goyal</b></p>
                                                    </div>
                                                    <p class="user-comment">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                                                </div>
                            
                                                <div class="comment">
                                                    <div class="flex">
                                                        <p class="name-bar"><b>Akhil Goyal</b></p>
                                                    </div>
                                                    <p class="user-comment">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                                                </div>
                            
                                                <div class="comment">
                                                    <div class="flex">
                                                        <p class="name-bar"><b>Akhil Goyal</b></p>
                                                    </div>
                                                    <p class="user-comment">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                                                </div>
                            
                                            </div>
                            
                                        </div>
                                            `
                

                // db
                //     .collection('Users')
                //     .onSnapshot((querySnapshot) => {
                //         querySnapshot.forEach((userDoc) => {
                //             if (doc.id === userDoc.id) {
                //                 threadAuthor.innerHTML = `${userDoc.data().full_name}`;
                //             }
                //         })
                //     })

                // threadTitle.innerHTML = doc.data().thread_title
                // threadDesc.innerHTML = doc.data().thread_description
                // threadDate.innerHTML = doc.data().timestamp.toDate().toDateString();

                // listRef
                //     .listAll()
                //     .then(function (res) {

                //         console.log('ITEMS : ', res.items);

                //         res.items.forEach(function (itemRef) {
                //             itemRef
                //                 .getDownloadURL()
                //                 .then(function (downloadURL) {
                //                     doc.data().thread_attachments.map(img => {
                //                         if (downloadURL.includes(img)) {
                //                             // attachmentImage.src = downloadURL

                //                             threadContainer.innerHTML += `
                //                             <div class="thread shadow">
                            
                //                             <div class="flex">
                //                                 <img src="../resources/images/user_avatar.png" class="thread-image" width="20" alt="">
                //                                 <i class="fas fa-circle online-user"></i>
                //                                 <p class="name-bar"><b></b></p>
                //                                 <b class="time-bar text-right flex-auto">${doc.data().timestamp.toDate().toDateString()}</b>
                //                             </div>
                            
                //                             <div class="thread-content">
                            
                //                                 <div class="plain-content">
                //                                     <p class="thread-title-dashboard"><b>${doc.data().thread_title}</b></p>
                //                                     <p class="thread-desc-dashboard"><b>${doc.data().thread_description}</b></p>
                //                                 </div>
                            
                //                                 <div class="thread-attachments">
                //                                     <img class="image-attachment" src=${downloadURL} alt="">
                //                                 </div>
                            
                //                                 <div class="add-comment">
                //                                     <p>Add comment:</p>
                //                                     <div class="flex comment-input">
                //                                         <input type="text">
                //                                         <button class="post-button">Post</button>
                //                                     </div>
                //                                 </div>
                            
                //                                 <div>
                //                                     <p class="text-right color-website"><b>4 Comments</b></p>
                //                                 </div>
                            
                //                             </div>
                            
                //                             <div class="thread-comments">
                            
                //                                 <div class="comment">
                //                                     <div class="flex">
                //                                         <p class="name-bar"><b>Akhil Goyal</b></p>
                //                                     </div>
                //                                     <p class="user-comment">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                //                                 </div>
                            
                //                                 <div class="comment">
                //                                     <div class="flex">
                //                                         <p class="name-bar"><b>Akhil Goyal</b></p>
                //                                     </div>
                //                                     <p class="user-comment">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                //                                 </div>
                            
                //                                 <div class="comment">
                //                                     <div class="flex">
                //                                         <p class="name-bar"><b>Akhil Goyal</b></p>
                //                                     </div>
                //                                     <p class="user-comment">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                //                                 </div>
                            
                //                             </div>
                            
                //                         </div>
                //                             `
                //                         }
                //                     })
                //                 })
                //                 .catch((error) => console.log("error", error));
                //         });

                //     })
                //     .catch((error) => console.log("error", error));

            });
        });

    // db
    //     .collection("threads")
    //     .orderBy("timestamp", "asc")
    //     .onSnapshot((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {

    //             threadContainer.innerHTML = `
    //             <div class="thread shadow">

    //             <div class="flex">
    //                 <img src="../resources/images/user_avatar.png" class="thread-image" width="20" alt="">
    //                 <i class="fas fa-circle online-user"></i>
    //                 <p class="name-bar"><b></b></p>
    //                 <b class="time-bar text-right flex-auto"></b>
    //             </div>

    //             <div class="thread-content">

    //                 <div class="plain-content">
    //                     <p class="thread-title-dashboard"><b>${doc.data().thread_title}</b></p>
    //                     <p class="thread-desc-dashboard"><b>${doc.data().thread_description}</b></p>
    //                 </div>

    //                 <div class="thread-attachments">
    //                     <img class="image-attachment" src="../resources/images/attachment_icon.png" alt="">
    //                 </div>

    //                 <div class="add-comment">
    //                     <p>Add comment:</p>
    //                     <div class="flex comment-input">
    //                         <input type="text">
    //                         <button class="post-button">Post</button>
    //                     </div>
    //                 </div>

    //                 <div>
    //                     <p class="text-right color-website"><b>4 Comments</b></p>
    //                 </div>

    //             </div>

    //             <div class="thread-comments">

    //                 <div class="comment">
    //                     <div class="flex">
    //                         <p class="name-bar"><b>Akhil Goyal</b></p>
    //                     </div>
    //                     <p class="user-comment">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
    //                 </div>

    //                 <div class="comment">
    //                     <div class="flex">
    //                         <p class="name-bar"><b>Akhil Goyal</b></p>
    //                     </div>
    //                     <p class="user-comment">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
    //                 </div>

    //                 <div class="comment">
    //                     <div class="flex">
    //                         <p class="name-bar"><b>Akhil Goyal</b></p>
    //                     </div>
    //                     <p class="user-comment">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
    //                 </div>

    //             </div>

    //         </div>
    //             `

    //         });
    //     });

    // actualBtn.addEventListener('change', function () {
    //     fileChosen.innerHTML = ''
    //     for (var i = 0; i < this.files.length; i++) {
    //         fileChosen.appendChild(spanElement(this.files[i]))
    //     }
    //     fileChosen.classList.remove(`hidden`)

    // })

})