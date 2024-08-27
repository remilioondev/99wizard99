document.addEventListener('DOMContentLoaded', (event) => {
    console.debug('DOM Loaded - Start the magic');

    // Remove the display property after the font loads
    async function isReady() {
        let ready = await document.fonts.ready;
        document.querySelector(".m-scroll").style.display = "inline-flex";
    }

    isReady();

    // Expand/Collapse Wizard Maker

    const wizardMakerButtonElement = document.getElementById('wizard-maker-button');
    const wizardMakerCollapsable = document.querySelector(".cs-content-canvas");

    wizardMakerButtonElement.addEventListener('click', (event) => {
        if (wizardMakerCollapsable.style.display === "flex") {
            wizardMakerCollapsable.style.display = "none";
        } else {
            wizardMakerCollapsable.style.display = "flex";
        }
    });

    // Wizard Maker

    const fileInputElement = document.querySelector('#fileInput');
    const canvasContainerElement = document.querySelector('#canvas-container');
    const canvasElement = document.querySelector('#canvas');
    const downloadButtonElement = document.querySelector('#download');
    const gearElements = document.querySelectorAll('.gear');

    const canvasFabric = new fabric.Canvas(canvasElement);

    fileInputElement.addEventListener('change', (event) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const image = new Image();

            image.src = e.target.result;
            image.onload = () => {
                const imageFabric = new fabric.Image(image);
                const scalePercentage = canvasFabric.width / imageFabric.width;
                canvasFabric.setBackgroundImage(imageFabric, canvasFabric.renderAll.bind(canvasFabric), {
                    scaleX: canvasFabric.width / imageFabric.width,
                    scaleY: scalePercentage
                });
                canvasFabric.setHeight(imageFabric.height * scalePercentage);
                //canvasElement.height = canvasFabric.height;
                //canvasContainerElement.height = canvasFabric.height;
            }
        }
        reader.readAsDataURL(event.target.files[0]);
    });

    gearElements.forEach((element) => {
        element.addEventListener('dragstart', (event) => {
            //transfer the "data" i.e. id of the target dragged.
            event.dataTransfer.setData("id", event.target.id);
        });

        element.addEventListener('touchend', (event) => {
            event.preventDefault();

            //receiving the "data" i.e. id of the target dropped.
            const data = event.target.id;

            //getting the target image info through its id.
            const gearElement = document.getElementById(data);

            //initializing the fabric image.
            const imageFabric = new fabric.Image(gearElement, {
                left: 100,
                top: 100,
            });
            imageFabric.scaleToWidth(gearElement.width);
            imageFabric.scaleToHeight(gearElement.height);

            canvasFabric.add(imageFabric);
        });
    });

    canvasContainerElement.addEventListener('dragover', (event) => {
        event.preventDefault();
        return false;
    });

    canvasContainerElement.addEventListener('touchmove', (event) => {
        event.preventDefault();
        console.log(12);
        return false;
    });

    canvasContainerElement.addEventListener('drop', (event) => {
        event.preventDefault();

        //receiving the "data" i.e. id of the target dropped.
        const data = event.dataTransfer.getData("id");

        //getting the target image info through its id.
        const gearElement = document.getElementById(data);

        //initializing the fabric image.
        const imageFabric = new fabric.Image(gearElement, {
            left: event.layerX - 80,
            top: event.layerY - 40,
        });

        imageFabric.scaleToWidth(gearElement.width);
        imageFabric.scaleToHeight(gearElement.height);

        canvasFabric.add(imageFabric);
    });

    addEventListener('keydown', (event) => {
        // Check for allowed keys on keydown with Code
        if (event.keyCode === 8 || event.keyCode === 46) {
            canvasFabric.remove(canvasFabric.getActiveObject());
        }
    });

    downloadButtonElement.addEventListener('click', (event) => {
        canvasFabric.discardActiveObject();
        canvasFabric.renderAll();
        const downloadLink = document.createElement('a');

        downloadLink.setAttribute('download', 'My Wizard.png');
        canvasElement.toBlob((blob) => {
            const url = URL.createObjectURL(blob);

            downloadLink.setAttribute('href', url);
            downloadLink.click();
        });
    });

   let clipboard = new ClipboardJS('#copy');

    clipboard.on('success', function(e) {
        console.log(e);
        e.trigger.innerHTML ="copied !"
    });
});