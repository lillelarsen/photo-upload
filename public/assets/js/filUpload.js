//Checker om browseren understøtter drag-funktionerne m.m.
function featureChecker() {
    const form = document.querySelector('form');
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
        e.stopPropagation(); // stopper bubbling, events bobler ikke op i event-træet
    }

    form.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;
        
        let reader = new FileReader(); //ny version af filereader
        // Skaber vores preview/crop-funktion
        reader.onload = function (e) {
            const img = document.querySelector('.previewImage');
            img.setAttribute('src', e.target.result);
            // console.log(img.naturalWidth);
            // console.log(img.naturalHeight);
            
            let counter = 0;
            let coords = {};
            img.addEventListener('click', (event) => {
                // gemmer vores 2 punkter i objektet ovenover
                if(counter <= 1) {
                    if (counter === 0) {
                        coords.punkt1 = {
                            x: event.offsetX,
                            y: event.offsetY
                        }
                    } else {
                        coords.punkt2 = {
                        x: event.offsetX,
                        y: event.offsetY
                    }
                }
                // laver højst 2 punkter
                    const parent = img.parentNode;
                    const div1 = document.createElement('div');
                    div1.setAttribute('class', 'divKnap');
                    div1.style.top = `${event.offsetY - 5}px`;
                    div1.style.left = `${event.offsetX - 5}px`;
                    parent.appendChild(div1);
                    
                    counter++;
                // giver vi de to punkter sker nedenstående (cropper)
                    if (counter === 2) {
                        let width = coords.punkt2.x - coords.punkt1.x;
                        let height = coords.punkt2.y - coords.punkt1.y;
                        
                        const canvas = document.querySelector('.finalImage');
                        canvas.setAttribute('width', Math.abs(width));
                        canvas.setAttribute('height', Math.abs(height));

                        const ctx = canvas.getContext('2d');
                                                
                        let position = {
                            x: Math.min(coords.punkt1.x, coords.punkt2.x),
                            y: Math.min(coords.punkt1.y, coords.punkt2.y)
                        }
                        
                        let scale = img.naturalHeight / img.height;

                        ctx.drawImage(img, position.x * scale, 
                                        position.y * scale, 
                                        Math.abs(width) * scale, 
                                        Math.abs(height) * scale,
                                        0, 0,
                                        Math.abs(width),
                                        Math.abs(height)
                                    );
                        const dataURL = canvas.toDataURL();
                        // For hver fil efter komma splitter vi og laver en ny blob-fil af vores billede
                        const blobBin = atob(dataURL.split(',')[1]);
                        const array = [];
                        for(let i = 0; i < blobBin.length; i++){
                            array.push(blobBin.charCodeAt(i));
                        }
                        const file = new Blob([new Uint8Array(array)], {type: 'image/png'});
                        uploadFile(file);
                        // Base64 et enkelt bogstav har 64 tegn 
                    }
                } 
            });
            
        }

        // handleFiles(files);

        reader.readAsDataURL(files[0]);

        
    }

    function handleFiles(files) {
        ([...files]).forEach(uploadFile); // ... er spreadoperator, så den laver et array over files, som ikke var et array
    }

    function uploadFile(file) {
        let URL = '/upload';
        let formData = new FormData();

        formData.append('file', file);

        fetch(URL, {
            method: 'POST',
            mode: "cors",
            body: formData
        })
            .then(response => {                
                if (response.status === 200) {
                    const successMessage = form.querySelector('.successMessage');
                    successMessage.classList.add('showMe');
                }
            })
            .catch(error => console.log(error));
    }
}