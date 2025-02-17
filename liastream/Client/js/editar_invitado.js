async function subirImagenAGitHub(contenidoBase64) {

    const repo = "desappweb82/desappweb82.github.io"; // Reemplaza con tu usuario/repositorio
    const randomName = `imagen-${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
    const rutaArchivo = `liastream/uploaded/${randomName}`; // Carpeta donde se guardará la imagen

    const url = `https://api.github.com/repos/${repo}/contents/${rutaArchivo}`;

    const response = await fetch(url, {
        method: "PUT",  // El método para crear o actualizar archivos
        headers: {
            "Authorization": `token ${mi_codigo_maestro}`,  // Agregamos el token en el header
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Subiendo imagen a GitHub",
            content: contenidoBase64  // Enviamos el contenido de la imagen en base64
        })
    });

    const json = await response.json();
    if (json.content && json.content.download_url) {
        console.log("Imagen subida con éxito: ", json.content.download_url);
        url_image_github = json.content.download_url;
        //alert("Imagen subida con éxito. URL: " + json.content.download_url);
    } else {
        console.error("Error al subir la imagen:", json);
    }

}

// Función para editar registros
async function editarRegistro(sheet_name) {
    const fileInput = document.getElementById('edit-fileInput');

    const old_nombre = $('#edit-oldnombre').val();
    const nombre = $('#edit-nombre').val();
    const cargo = $('#edit-cargo').val();
    const arroba_mas_redSocial = $('#edit-redSocial').val();
    const redSocial = '@' + arroba_mas_redSocial;
    const ubicacion = $('#edit-ubicacion').val();
    const tema = $('#edit-tema').val();

    if (fileInput.files.length === 0) {
        const data = {
            sheet_name,
            old_nombre,
            nombre,
            cargo,
            redSocial,
            ubicacion,
            tema,
            file_update: 'no'
        };

        const response = await fetch(`${apiUrl}?action=actualizar_invitados_en_cliente&data=${decodeURIComponent(JSON.stringify(data))}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        } else {
            resetForm();
            //cargar_pagina('paginas/lista_de_invitados/lista_de_invitados.html', 'Lista de Invitados');
            load_view('Lista de Invitados', lista_de_invitados);
            leerRegistros(sheet_name);

        }
    } else {
        
        const file = fileInput.files[0];
        const reader = new FileReader();

        if (file.size > 2 * 1024 * 1024) {
            alert("El archivo es demasiado grande (máx: 2 MB).");
            load_view('Lista de Invitados', lista_de_invitados);
            leerRegistros(sheet_name);
            return;
        }

        await subirImagenAGitHub(contenidoBase64);

        console.log(url_image_github);

        reader.onload = async function (e) {

            const data = {
                sheet_name,
                old_nombre,
                nombre,
                cargo,
                redSocial,
                ubicacion,
                tema,
                file_update: 'si',
                urlImage: url_image_github
            };

            const response = await fetch(`${apiUrl}?action=actualizar_invitados_en_cliente&data=${decodeURIComponent(JSON.stringify(data))}`);

            if (!response.ok) {

                resetForm();
                load_view('Lista de Invitados', lista_de_invitados);
                leerRegistros(sheet_name);

                throw new Error(`Error: ${response.statusText}`);
            } else {
                resetForm();
                load_view('Lista de Invitados', lista_de_invitados);
                leerRegistros(sheet_name);

            }
        };

        reader.readAsArrayBuffer(file_array);
    }

    function resetForm() {
        $('.edit-panel-loader-add').addClass('d-none');
        $('#edit-nombre').val('');
        $('#edit-cargo').val('');
        $('#edit-redSocial').val('');
        $('#edit-ubicacion').val('');
        $('#edit-tema').val('');
        $('#edit-fileInput').val('');
        $('.edit-panel-foto').css('background-image', 'url("")');
    }
}

$(document).ready(function () {

    let url_image;

    $('.edit-btn-subir').on('click', function () {
        $('#edit-fileInput').click();
    });

    $('.edit-btn-guardar').on('click', function () {

        let hasError = false;

        $(this).closest('form').find('input').each(function (index) {
            let fileInput = $(this).attr('type');
            if (fileInput != 'file') {
                let value = $(this).val();
                if (value === '') {
                    hasError = true;
                    $(this).closest('div').find('span').removeClass('d-none');
                }
            }
        });

        if (hasError) {
            return;
        }

        $('.edit-panel-loader-add').removeClass('d-none');
        editarRegistro(sheet_name);
    });

    $('#edit-fileInput').on('change', function (event) {

        const file = this.files[0];
        if (file) {
            const readerA = new FileReader();
            readerA.onload = function (e) {
                file_array = file;
                file_name = file.name;
                file_type = file.type;
                //console.log(e.target.result);
            }
            readerA.readAsArrayBuffer(file);

            const reader = new FileReader();
            reader.onload = function (event) {

                const base64String = reader.result.split(",")[1];
                contenidoBase64 = base64String;

                img_result = event.target.result;

                $('.edit-panel-foto').css({
                    'background-image': `url(${event.target.result})`,
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat',
                    'background-position': 'center',
                });

                const img = document.querySelector('.edit-image-foto'); // Usar un elemento HTML real
                img.src = event.target.result; // Establecer la fuente de la imagen

                // Inicializar Cropper.js
                const cropper = new Cropper(img, {
                    viewMode: 1,
                    autoCropArea: 1,
                    aspectRatio: 1,
                    ready: function () {
                        // Recortar automáticamente a 200x200
                        const canvas = cropper.getCroppedCanvas({
                            width: 200,
                            height: 200,
                        });

                        canvas.toBlob((blob) => {
                            // Subir la imagen recortada
                            //uploadImage(blob);
                            file_array = blob;
                            console.log(file_array);
                        }, 'image/jpeg', 0.8);

                        // Destruir el Cropper después del recorte automático
                        cropper.destroy();
                    },
                });

            }
            reader.readAsDataURL(file);

        }

    });
});