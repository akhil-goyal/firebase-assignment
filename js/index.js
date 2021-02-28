function previewFile() {
    let preview = document.querySelector('img');
    let file = document.querySelector('input[type=file]').files[0];
    let reader = new FileReader();

    reader.addEventListener("load", function () {
        preview.src = reader.result;
        document.getElementById(`profile-photo-span`).remove()
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}
document.getElementById(`profile-image1`).addEventListener(`click`, () => {
    document.getElementById(`profile-image-upload`).click()
})

