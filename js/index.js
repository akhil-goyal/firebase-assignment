function previewFile() {

    let photoSpan = document.getElementById(`profile-photo-span`);
    let preview = document.querySelector('img');
    let file = document.querySelector('input[type=file]').files[0];
    let reader = new FileReader();

    reader.addEventListener("load", function () {
        preview.src = reader.result;
        if (photoSpan !== null)
            photoSpan.remove()
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

document.getElementById(`profile-image1`).addEventListener(`click`, () => {
    document.getElementById(`profile-image-upload`).click()
})

document.getElementById(`profile-image`).addEventListener(`click`, () => {
    document.getElementById(`settings-picture`).click()
})

