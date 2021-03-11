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

    let postCommentButtons = document.querySelectorAll('.post-button');

    const db = firebase.firestore();

    const user = JSON.parse(localStorage.getItem('userData'));

    console.log('DASHBOARD : ', user);

    userName.innerHTML = `Welcome, ${user.userName}`;

    const listRef = firebase.storage().ref("images");



    const CreateThreadElements = (images) => {
        let dummyValues = ``
        if (images.length > 0)
            images.map((elem) => dummyValues += `<img class="image-attachment" src="${elem}" alt="">`)
        return `<div class="thread-attachments">${dummyValues}</div>`
    }


    const postComment = (event) => {


        event.preventDefault();

        const threadId = event.target.id;

        const comment = document.getElementById(`post-comment-${threadId}`);

        alert(comment);
    }

    postCommentButtons.forEach(commentBtn =>
        box.addEventListener(`click`, postComment)
    )

    const commentsSection = (comments) => {
        let dummyValues = ``
        if (comments !== undefined && comments.length > 0)
            images.map((elem) => dummyValues += `<div class="comment">
                                                    <div class="flex">
                                                        <p class="name-bar"><b></b></p>
                                                    </div>
                                                    <p class="user-comment"></p>
                                                </div>`
            )
        return dummyValues
    }

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


    db
        .collection("threads")
        .orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {

            threadContainer.innerHTML = ``;

            querySnapshot.forEach((doc) => {
                const thread_elements = CreateThreadElements(doc.data().thread_attachments)
                //Need to find comments from comment table
                const _comments = commentsSection()
                const _commentCount = 0
                threadContainer.innerHTML += `
                                            <div class="thread shadow">

                                            <div class="flex">
                                                <img src="../resources/images/user_avatar.png" class="thread-image" width="20" alt="">
                                                <i class="fas fa-circle online-user"></i>
                                                <p class="name-bar"><b>${doc.data().user_name}</b></p>
                                                <b class="time-bar text-right flex-auto">${doc.data().timestamp.toDate().toDateString()}</b>
                                            </div>
                            
                                            <div class="thread-content">
                            
                                                <div class="plain-content">
                                                    <p class="thread-title-dashboard"><b>${doc.data().thread_title}</b></p>
                                                    <p class="thread-desc-dashboard"><b>${doc.data().thread_description}</b></p>
                                                </div>

                                                ${thread_elements}
                            
                                                <div class="add-comment">
                                                    <p>Add comment:</p>
                                                    <div class="flex comment-input">
                                                        <input id="post-comment-${doc.id}" class="post-comment" type="text">
                                                        <button id="${doc.id}" type="submit" class="post-button">Post</button>
                                                    </div>
                                                </div>
                            
                                                <div>
                                                    <p class="text-right color-website"><b>${_commentCount} Comments</b></p>
                                                </div>
                            
                                            </div>
                            
                                            <div class="thread-comments">                            
                                                ${_comments}                            
                                            </div>
                            
                                        </div>
                                            `
            })
        });

})
