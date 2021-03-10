document.addEventListener('DOMContentLoaded', () => {

    const actualBtn = document.getElementById('actual-btn');
    const fileChosen = document.getElementById('uploaded-files');
    const userName = document.querySelector('.user-name');
    const userImage = document.querySelector('#profile-image1');

    const user = JSON.parse(localStorage.getItem('userData'));

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
        console.log('elem', elem);
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
        fileChosen.innerHTML = ''
        for (var i = 0; i < this.files.length; i++) {
            fileChosen.appendChild(spanElement(this.files[i]))
        }
        fileChosen.classList.remove(`hidden`)

    })

})