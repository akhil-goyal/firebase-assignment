function previewFile() {

    let photoSpan = document.getElementById(`profile-photo-span`);
    let previewMain = document.getElementById('profile-image1');
    let previewSetting = document.getElementById('profile-image');
    let file = document.querySelector('input[type=file]').files[0];
    let reader = new FileReader();

    reader.addEventListener("load", function () {
        previewMain.src = reader.result
        previewSetting.src = reader.result
        if (photoSpan !== null)
            photoSpan.remove()
    }, false);

    if (file) {
        reader.readAsDataURL(file)
    }
}

previewMain.addEventListener(`click`, () => {
    document.getElementById(`profile-image-upload`).click()
})

previewSetting.addEventListener(`click`, () => {
    document.getElementById(`settings-picture`).click()
})

