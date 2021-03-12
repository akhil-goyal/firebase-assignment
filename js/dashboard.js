const db = firebase.firestore();
let loggedInUser;

document.addEventListener('DOMContentLoaded', () => {

    const userName = document.querySelector('.user-name');
    const userImage = document.querySelector('#profile-image1');

    let threadContainer = document.querySelector('.thread-list');

    firebase.auth().onAuthStateChanged((currentUser) => {
        if (currentUser) {
            getUser(currentUser.uid);
        } else {
            console.log('User is not authenticated.');
        }
    });

    const getUser = (uid) => {
        db.collection("Users")
            .doc(uid)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    loggedInUser = doc.data();
                    userName.innerHTML = `Welcome, ${doc.data().full_name}`;
                    userImage.src = doc.data().profile_image;
                } else {
                    console.log("No such document");
                }
            });
    }

    const CreateThreadElements = (images) => {
        let dummyValues = ``
        if (images.length > 0)
            images.map((elem) => dummyValues += `<img class="image-attachment" src="${elem}" alt="">`)
        return `<div class="thread-attachments">${dummyValues}</div>`
    }

    const timeStamp = (datevalue) => {
        const _timeStmp = new Date(datevalue).getTime()
        const newDate = new Date(_timeStmp * 1000)
        const Hours = newDate.getHours()
        const Minutes = newDate.getMinutes()
        return (Hours < 10 ? '0' + Hours : Hours) + ':' + (Minutes < 10 ? '0' + Minutes : Minutes)
    }

    const commentsSection = (userName, comment, time) => {
        const getTime = timeStamp(time)
        return `<div class="comment">
                    <div class="flex">
                        <p class="name-bar width-100"><b>${userName}</b><span class="time-bar-comments float-right span-time flex-auto">${time} ${getTime}</span></p>
                        
                    </div>
                    <p class="user-comment">${comment}</p>
                </div>`;
    }

    const fetchComments = (threadId) => {
        let commentsArray = [];
        db
            .collection("comments").where("thread_id", "==", threadId)
            .onSnapshot((querySnapshot) => {
                const commentBox = document.getElementById(`thread-${threadId}`)
                const commentCount = document.getElementById(`commentCount-${threadId}`)
                commentBox.innerHTML = ``
                commentCount.innerHTML = `${querySnapshot.size} comment(s)`
                querySnapshot.forEach((doc) => {
                    commentBox.innerHTML +=
                        commentsSection(doc.data().user_name, doc.data().comment, doc.data().timestamp.toDate())
                })
            })

        return commentsArray;
    }

    db
        .collection("threads")
        .orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {

            threadContainer.innerHTML = ``;

            querySnapshot.forEach((doc) => {

                const thread_elements = CreateThreadElements(doc.data().thread_attachments);

                fetchComments(doc.id)

                const _timeStamp = timeStamp(doc.data().timestamp.toDate())

                const _commentCount = 0;

                console.log(doc.data());

                db
                    .collection("Users")
                    .orderBy("timestamp", "desc")
                    .onSnapshot((querySnapshot) => {

                        querySnapshot.forEach((userDoc) =>

                            threadContainer.innerHTML += `
                                            <div class="thread thread-shadow">

                                            <div class="flex">
                                                <img src=${userDoc.data().profile_image} class="thread-image" width="20" alt="">
                                                <i class="fas fa-circle online-user"></i>
                                                <p class="name-bar"><b>${userDoc.data().full_name}</b></p>
                                                <b class="time-bar text-right flex-auto">${doc.data().timestamp.toDate().toDateString()} ${_timeStamp}</b>
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
                                                        <button onclick="postComment('${doc.id}')" type="submit" class="post-button">Post</button>
                                                    </div>
                                                </div>
                            
                                                <div>
                                                    <p class="text-right color-website"><b id="commentCount-${doc.id}">${_commentCount} Comments</b></p>
                                                </div>
                            
                                            </div>
                            
                                            <div id="thread-${doc.id}" class="thread-comments">                        
                                            </div>
                            
                                        </div>
                                            `

                        )
                    })
            });

        });

})

const postComment = (threadId) => {

    const comment = document.getElementById(`post-comment-${threadId}`);

    const userName = loggedInUser.full_name;

    console.log(loggedInUser)

    db.collection("comments")
        .doc(loggedInUser.user_id)
        .set({
            comment: comment.value,
            thread_id: threadId,
            user_name: userName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
            alert('Comment Posted!');
        })
        .catch((err) => console.log("err", err));
}

