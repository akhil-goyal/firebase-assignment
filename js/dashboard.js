const user = JSON.parse(localStorage.getItem('userData'));
const db = firebase.firestore();

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

    console.log('DASHBOARD : ', user);

    userName.innerHTML = `Welcome, ${user.userName}`;
    userImage.src = user.userImage;

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

    const commentsSection = (userName, Comment, Time) => {
        const getTime = timeStamp(Time)
        return `<div class="comment">
                    <div class="flex">
                        <p class="name-bar width-100"><b>${userName}</b><span class="time-bar-comments float-right span-time flex-auto">${Time.toDateString()} ${getTime}</span></p>
                        
                    </div>
                    <p class="user-comment">${Comment}</p>
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
                const thread_elements = CreateThreadElements(doc.data().thread_attachments)
                fetchComments(doc.id)
                const _timeStamp = timeStamp(doc.data().timestamp.toDate())
                const _commentCount = 0
                threadContainer.innerHTML += `
                                            <div class="thread thread-shadow">

                                            <div class="flex">
                                                <img src="../resources/images/user_avatar.png" class="thread-image" width="20" alt="">
                                                <i class="fas fa-circle online-user"></i>
                                                <p class="name-bar"><b>${doc.data().user_name}</b></p>
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
            })
        });

})

const postComment = (threadId) => {

    const comment = document.getElementById(`post-comment-${threadId}`);

    const userName = user.userName;

    db.collection("comments")
        .doc(user.uid)
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

