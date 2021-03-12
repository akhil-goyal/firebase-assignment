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
                    userImage.src = doc.data().profile_image == "" ? "../../resources/images/user_avatar_white.png" : doc.data().profile_image;
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
        return `<div class="comment">
                    <div class="flex">
                        <p class="name-bar-commentUser" width-100"><b>${userName}</b><span class="time-bar-comments float-right span-time flex-auto">${time.toDateString()} ${timeStamp(time)}</span></p>
                        
                    </div>
                    <p class="user-comment">${comment}</p>
                </div>`;
    }

    async function fetchGlobalUser(user_id, commentBox, comment, timestamp) {
        db
            .collection("Users").where("user_id", "==", user_id)
            .onSnapshot((querySnapshot) => {
                querySnapshot.forEach((userDoc) => {
                    const details = userDoc.data()
                    commentBox.innerHTML +=
                        commentsSection(details.full_name, comment, timestamp.toDate())
                })
            })
    }

    const fetchUserDetails = (userId, threadId) => {
        var userDetails = []

        db
            .collection("Users").where("user_id", "==", userId)
            .onSnapshot((querySnapshot) => {

                setTimeout(() => {
                    querySnapshot.forEach((userDoc) => {
                        const details = userDoc.data()
                        const threadImage = document.getElementById(`thread-image-${threadId}`)
                        const threadCreatedBy = document.getElementById(`name-bar-${threadId}`)
                        threadCreatedBy.innerHTML = ``
                        if (details.profile_image != "") {
                            threadImage.src = details.profile_image
                        }
                        threadCreatedBy.innerHTML = `<b>${details.full_name}</b>`
                    })

                }, 1000)
            })


        return userDetails
    }

    const fetchComments = (threadId) => {
        db
            .collection("comments").where("thread_id", "==", threadId)
            .onSnapshot((querySnapshot) => {
                const commentBox = document.getElementById(`thread-${threadId}`)
                const commentCount = document.getElementById(`commentCount-${threadId}`)
                commentBox.innerHTML = `<div class="text-center"><img src="../resources/images/loader.svg" alt=""></div>`
                commentCount.innerHTML = `${querySnapshot.size} comment(s)`
                setTimeout(() => {
                    commentBox.innerHTML = ``
                    querySnapshot.forEach((doc) => {
                        fetchGlobalUser(doc.data().user_id, commentBox, doc.data().comment, doc.data().timestamp)
                    })
                }, 1000);
            })
    }

    db
        .collection("threads")
        .orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {

            setTimeout(() => {
                threadContainer.innerHTML = ``

                querySnapshot.forEach((doc) => {

                    const thread_elements = CreateThreadElements(doc.data().thread_attachments)
                    const _timeStamp = timeStamp(doc.data().timestamp.toDate())
                    const _commentCount = 0

                    fetchComments(doc.id)

                    fetchUserDetails(doc.data().user_id, doc.id)

                    threadContainer.innerHTML += `
                                            <div class="thread thread-shadow">

                                            <div class="flex">
                                                <img src="../../resources/images/user_avatar.png" id="thread-image-${doc.id}" class="thread-image" width="20" alt="">
                                                <i class="fas fa-circle online-user"></i>
                                                <p class="name-bar" id="name-bar-${doc.id}"><b>Loading..</b></p>
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
                            
                                        </div>`
                });
            }, 4000);
        });

})

const postComment = (threadId) => {
    const comment = document.getElementById(`post-comment-${threadId}`);
    if (comment.value != ``) {
        db.collection("comments")
            .add({
                comment: comment.value,
                thread_id: threadId,
                user_id: loggedInUser.user_id,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {

            })
            .catch((err) => console.log("err", err));
    }
}
