document.addEventListener('DOMContentLoaded', () => {

    const actualBtn = document.getElementById('actual-btn');
    const fileChosen = document.getElementById('uploaded-files');
    const userName = document.querySelector('.user-name');
    const userImage = document.querySelector('#profile-image1');
    const threadForm = document.querySelector('.create-thread-form');
    const threadTitle = document.querySelector('#thread-title');
    const threadDesc = document.querySelector('#thread-description');

    const db = firebase.firestore();

    const user = JSON.parse(localStorage.getItem('userData'));

    // create global file var
    let files = [];
    let fileName = "";
    let fileExt = "";

    let fileNames=[];

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

    threadForm.addEventListener('submit', (event) => {

        event.preventDefault();

        // create var to save filename in storage
        let uploadedFileName = '';

        // if file is uploaded 
        if (files.length > 0) {

            files.map(file => {

                // get unique image id
                const imageId = db.collection("Images").doc().id;

                // create file name using id and ext
                uploadedFileName = `${imageId}.${file.fileExtension}`;

                fileNames.push(uploadedFileName);
                
                // get image ref from storage
                const storageRef = firebase.storage().ref(`images/${uploadedFileName}`);

                // upload image
                storageRef.put(file.fileData);

            });

        }

        if (threadTitle.value && threadDesc.value) {

            const user = firebase.auth().currentUser;

            db.collection("threads")
                .doc(user.uid)
                .set({
                    thread_title: threadTitle.value,
                    thread_description: threadDesc.value,
                    thread_attachments: fileNames,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(function () {
                    alert('Thread created successfully!');
                    // redirect to dashboard
                    // window.location = "dashboard.html";
                })
                .catch(function (error) {
                    console.log("Error adding document", error);
                });

        }

    })

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

        return span
    }

    actualBtn.addEventListener('change', function () {

        fileChosen.innerHTML = '';

        for (var i = 0; i < this.files.length; i++) {

            const data = {
                fileData: this.files[i],
                fileName: this.files[i].name.split('.').shift(),
                fileExtension: this.files[i].name.split(".").pop()
            }

            files.push(data);

            fileChosen.appendChild(spanElement(this.files[i]))

        }

        console.log('Files array : ', files)

        fileChosen.classList.remove(`hidden`)

    })

})