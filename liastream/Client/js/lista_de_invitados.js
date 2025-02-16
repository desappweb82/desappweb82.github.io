async function leerRegistros(sheet_name) {
    try {
        var title = sheet_name.toString().toUpperCase();
        $('#title-lista-invitados').text(`Lista de Invitados: ${title}`);
        $('.btn-float').addClass('d-none');
        $('.panel-loader').removeClass('d-none');

        const response = await fetch(`${apiUrl}?action=leer_invitados_en_cliente&sheet_name=${sheet_name}`);

        if (!response.ok) {
            throw new Error('Error en la respuesta: ' + response.statusText);
        }

        const lista = $('.lista-invitados');
        lista.each(function (index) {
            $('.elem-item').remove();
        });
        const data = await response.json();
        let count = 0;
        data.forEach((registro) => {
            count++;
            let img = registro[5].toString().split('=');
            const item = `
        <div class="elem-item d-flex gap-3 border-bottom p-1 bg-white" data-id="${count}">        
            <div class="foto" src="https://drive.google.com/thumbnail?id=${img[1]}" style="width: 100px; height: 100px; background-image: url('https://drive.google.com/thumbnail?id=${img[1]}'); background-size: cover; background-position: center;">
              <!--<img class="foto border" src="https://drive.google.com/thumbnail?id=${img[1]}" width="100" height="100" />-->
            </div>
                              
          <div class="d-flex flex-column flex-fill" style="font-size:11px;">
            <span><b class="text-danger">Nombre:</b><br> <span class="field-nombre">${registro[0]}</span></span>
            <span><b class="text-danger">Cargo:</b><br> <span class="field-cargo">${registro[1]}</span></span>
            <input class="field-redSocial" type="hidden" value="${registro[2]}"/>
            <span><b class="text-danger">Ubicación:</b><br> <span class="field-ubicacion">${registro[3]}</span></span>
            <input class="field-tema" type="hidden" value="${registro[4]}"/>
          </div>

          <div class="d-flex flex-column">

            <a class="btn-editar btn" type="button" href="javascript:void(0);">
              <i class="far fa-edit text-black-50"></i>
            </a>
                              
            <a class="btn-borrar btn" type="button" href="javascript:void(0);">
              <i class="far fa-trash-alt text-black-50"></i>
            </a>

          </div>

          <input class="row-nombre" type="hidden" value="${registro[0]}"/><!-- Nombre -->
          <input class="row-cargo" type="hidden" value="${registro[1]}"/><!-- Cargo -->
          <input class="row-redSocial" type="hidden" value="${registro[2]}"/><!-- RedSocial -->
          <input class="row-ubicacion" type="hidden" value="${registro[3]}"/><!-- Ubicacion -->
          <input class="row-tema" type="hidden" value="${registro[4]}"/><!-- TEMA -->
          <input class="row-urldrive" type="hidden" value="${registro[5]}"/><!-- UrlDrive -->

        </div>`;
            lista.append(item);
            /** UI SORTABLE **/
            lista.sortable({
                placeholder: "ui-state-highlight",
                // Cursores son más relevantes en entornos de escritorio  
                // cursor: 'move', // Puedes comentar esta línea si hay problemas  
                start: function (event, ui) {
                    ui.placeholder.height(ui.item.height()); // Ajustar el tamaño del placeholder  
                },
                update: async function (event, ui) {

                    $('.panel-loader').removeClass('d-none');

                    let records = [];

                    lista.find('.elem-item').each(function (index) {
                        let nombre = $(this).find('.row-nombre').val();
                        let cargo = $(this).find('.row-cargo').val();
                        let redSocial = $(this).find('.row-redSocial').val();
                        let ubicacion = $(this).find('.row-ubicacion').val();
                        let tema = $(this).find('.row-tema').val();
                        let urldrive = $(this).find('.row-urldrive').val();
                        records.push([nombre, cargo, redSocial, ubicacion, tema, urldrive]);
                    });

                    const response_borrar_antes_de_ordenar_en_cliente = await fetch(`${apiUrl}?action=borrar_antes_de_ordenar_en_cliente&sheet_name=${sheet_name}`);
                    if (!response_borrar_antes_de_ordenar_en_cliente.ok) {
                        throw new Error(`Error: ${response_borrar_antes_de_ordenar_en_cliente.statusText}`);
                    } else {
                        console.log(response_borrar_antes_de_ordenar_en_cliente);
                    }

                    const response_crear_nuevo_orden_en_cliente = await fetch(`${apiUrl}?action=crear_nuevo_orden_en_cliente&sheet_name=${sheet_name}&records=${encodeURIComponent(JSON.stringify(records))}`);
                    if (!response_crear_nuevo_orden_en_cliente.ok) {
                        throw new Error(`Error: ${response_crear_nuevo_orden_en_cliente.statusText}`);
                    } else {
                        console.log(response);
                        $('.panel-loader').addClass('d-none');
                    }
                }
            });

            // Para asegurar que los elementos no son seleccionables  
            lista.disableSelection();
        });
        $('.panel-loader').addClass('d-none');
        lista.removeClass('d-none');
        $('.btn-float').removeClass('d-none');

    } catch (error) {
        console.error("Error al obtener registros:", error);
    }
}

// Función para borrar registros
async function borrarRegistro(sheet_name, nombre) {

    $('.panel-loader').removeClass('d-none');

    const data = {
        //nombre de la pestaña
        sheet_name: sheet_name,
        //Datos
        nombre: nombre
    };

    const response = await fetch(`${apiUrl}?action=borrar_invitados_en_cliente&data=${encodeURIComponent(JSON.stringify(data))}`);

    if (!response.ok) {

        load_view('Lista de Invitados', lista_de_invitados);
        leerRegistros(sheet_name);

        throw new Error('Error de solicitud: ' + response.statusText);
    }

    $('.panel-loader').addClass('d-none');

    //cargar_pagina('paginas/lista_de_invitados/lista_de_invitados.html', 'Lista de Invitados');
    load_view('Lista de Invitados', lista_de_invitados);
    leerRegistros(sheet_name);
}

$(document).ready(function () {
    
    leerRegistros(sheet_name);

    $(document).on('click', '.btn-borrar', function () {
        
        let nombre = $(this).closest('.elem-item').find('.field-nombre').text();
        if (confirm("¿Deseas borrar este invitado?")) {
            borrarRegistro(sheet_name, nombre);
        }
        return;
    });

    let url_image;

    function getItemList(nombre, cargo, redSocial, ubicacion, tema, foto) {

        load_view('Editar Invitados', editar_invitado);

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