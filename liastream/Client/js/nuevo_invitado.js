async function subirImagenAGitHub(contenidoBase64) {

    const repo = "desappweb82/desappweb82.github.io"; // Reemplaza con tu usuario/repositorio
    const randomName = `imagen-${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
    const rutaArchivo = `liastream/uploaded/${randomName}`; // Carpeta donde se guardará la imagen

    const url = `https://api.github.com/repos/${repo}/contents/${rutaArchivo}`;

    const response = await fetch(url, {
        method: "PUT",  // El método para crear o actualizar archivos
        headers: {
            "Authorization": `token ${token}`,  // Agregamos el token en el header
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
// Función para crear registros
async function crearRegistro(sheet_name) {

    const reader = new FileReader();

    const nombre = $('#nombre').val();
    const cargo = $('#cargo').val();
    const redSocial = $('#redSocial').val();
    const ubicacion = $('#ubicacion').val();
    const tema = $('#tema').val();

    await subirImagenAGitHub(contenidoBase64);

    console.log(url_image_github);

    console.log(file_name);

    reader.onload = async function (e) {
        const data = {
            //nombre de la pestaña
            sheet_name: sheet_name,
            //Datos
            nombre: nombre,
            cargo: cargo,
            redSocial: '@' + redSocial,
            ubicacion: ubicacion,
            tema: tema,
            urlImage: url_image_github
        };

        const response = await fetch(`${apiUrl}?action=nuevo_invitado_en_cliente&data=${decodeURIComponent(JSON.stringify(data))}`);

        if (!response.ok) {

            load_view('Lista de Invitados', lista_de_invitados);
            leerRegistros(sheet_name);

            throw new Error(`Error: ${response.statusText}`);

        } else {
            $('.panel-loader-add').addClass('d-none');
            $('#nombre').val('');
            $('#cargo').val('');
            $('#redSocial').val('');
            $('#ubicacion').val('');
            $('#tema').val('');
            $('#fileInput').val('');
            $('.panel-foto').css('background-image', 'url("")');

            //cargar_pagina('paginas/lista_de_invitados/lista_de_invitados.html', 'Lista de Invitados');
            load_view('Lista de Invitados', lista_de_invitados);
            leerRegistros(sheet_name);

        }
    };

    reader.readAsArrayBuffer(file_array);
}

$(document).ready(function () {

    $(document).on('click', '.btn-image', function () {
        // Restablecer todos los botones a 'btn-primary'
        $('.btn-image').removeClass('btn-success').addClass('btn-primary');

        // Establecer el botón clicado a 'btn-success'
        $(this).removeClass('btn-primary').addClass('btn-success');
    });

    //Guardar el nuevo invitado
    $('.btn-guardar').on('click', function () {

        let hasError = false;

        $(this).closest('form').find('input').each(function (index) {
            let value = $(this).val();
            if (value === '') {
                hasError = true;
                $(this).closest('div').find('span').removeClass('d-none');
            }
        });

        if (hasError) {
            return;
        }

        $('.panel-loader-add').removeClass('d-none');
        crearRegistro(sheet_name);
    });

    let cropper;

    $('.btn-subir').on('click', function () {
        $('#fileInput').click();
    });

    let img_result;

    $('#fileInput').on('change', function (event) {
        const file = this.files[0];

        if (file.size > 2 * 1024 * 1024) {
            alert("El archivo es demasiado grande (máx: 2 MB).");
            return;
        }

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

                $('.panel-foto').css({
                    'background-image': `url(${event.target.result})`,
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat',
                    'background-position': 'center',
                });

                const img = document.querySelector('.image-foto');
                img.src = event.target.result;

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

    let url_image;

    function getItemList(nombre, cargo, redSocial, ubicacion, tema, foto) {

        $('#edit-oldnombre').val(nombre);
        $('#edit-nombre').val(nombre);
        $('#edit-cargo').val(cargo);
        $('#edit-redSocial').val(redSocial);
        $('#edit-ubicacion').val(ubicacion);
        $('#edit-tema').val(tema);
        $('.edit-panel-foto').css('background-image', 'url("' + foto + '")');

    }

    $(document).on('click', '.btn-editar', function () {
        let nombre = $(this).closest('.elem-item').find('.field-nombre').text();
        let cargo = $(this).closest('.elem-item').find('.field-cargo').text();
        let arr_redSocial = $(this).closest('.elem-item').find('.field-redSocial').val().split('@');
        let redSocial = arr_redSocial[1];
        let ubicacion = $(this).closest('.elem-item').find('.field-ubicacion').text();
        let tema = $(this).closest('.elem-item').find('.field-tema').val();
        let foto = $(this).closest('.elem-item').find('.foto').attr('src');
        let count = tema.length;
        $('#edit-caracteres').text(`${count}/65`);

        getItemList(nombre, cargo, redSocial, ubicacion, tema, foto);

    });

});