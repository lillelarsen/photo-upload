function featureChecker() {
    const form = document.createElement('form');
    return (('draggable' in form) || ('ondragstart' in form && 'ondrop' in form)) && 'FileReader' in window && 'FormData' in window;
}

const form = document.querySelector('.filUploader');

if (featureChecker()) {
    form.classList.add('advancedForm');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        form.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation(); // stopper bubbling
    }

    form.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;
        
        let reader = new FileReader(); //ny version af filereader

        reader.onload = function (e) {
            const img = document.querySelector('.previewImage');
            img.setAttribute('src', e.target.result);
        }

        reader.readAsDataURL(files[0]);

        handleFiles(files);
    }

    function handleFiles(files) {
        ([...files]).forEach(uploadFile); // ... er spreadoperator, så den laver et array over files, som ikke var et array
    }

    function uploadFile(file) {
        let URL = 'http://localhost:3000/upload';
        let formData = new FormData();

        formData.append('file', file);

        fetch(URL, {
            method: 'POST',
            body: formData
        })
            .then(response => console.log(response))
            .catch(error => console.log(error));
    }
}