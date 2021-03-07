const actualBtn = document.getElementById('actual-btn');

const fileChosen = document.getElementById('uploaded-files');

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