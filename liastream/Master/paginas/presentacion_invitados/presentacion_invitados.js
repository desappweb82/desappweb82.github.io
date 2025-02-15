// Función para leer registros
async function leerPresentacionInvitados() {  
    try {  
        $('#presentacion-invitados .panel-loader').removeClass('d-none'); // Mostrar loader  

        const response = await fetch(`${apiUrl}?action=leer_presentacion_invitados`);  
        if (!response.ok) {  
            throw new Error('Error en la respuesta: ' + response.statusText);  
        }  
        
        const data = await response.json();  
        console.log('Lista de Presentacion de Invitados:', data);  

        const lista = $('.panel-presentacion-invitados');  
        lista.find('.p-elem-item').remove(); // Limpiar elementos existentes  

        data.forEach((registro) => {  
            let img = registro[2].toString().split('=');  
            const item = `  
                <div class="p-elem-item d-flex gap-3 border-bottom p-1 bg-white">  
                    <div class="foto"   
                        style="width: 100px; height: 100px; background-image: url('https://drive.google.com/thumbnail?id=${img[1]}'); background-size: cover; background-position: center;">  
                    </div>  
                    <div class="d-flex flex-column flex-fill" style="font-size:11px;">  
                        <span><b class="text-danger">Nombre:</b><br> <span class="row-nombre">${registro[0]}</span></span>  
                        <span><b class="text-danger">Cargo:</b><br> <span class="row-cargo">${registro[1]}</span></span>  
                    </div>  
                    <input class="row-input-nombre" type="hidden" value="${registro[0]}"/> <!-- Nombre -->  
                    <input class="row-input-cargo" type="hidden" value="${registro[1]}"/> <!-- Cargo -->  
                    <input class="row-input-urldrive" type="hidden" value="${registro[2]}"/> <!-- UrlDrive -->  
                </div>`;  
            lista.append(item);  
        });  

        /** UI SORTABLE **/  
        lista.sortable({  
            placeholder: "ui-state-highlight",  
            start: function(event, ui) {  
                ui.placeholder.height(ui.item.height()); // Ajustar el tamaño del placeholder  
            },  
            update: async function(event, ui) {  
                $('#presentacion-invitados .panel-loader').removeClass('d-none'); // Mostrar loader  

                
                const borrarResponse = await fetch(`${apiUrl}?action=borrarAntesOrdenarPresentacionInvitados`);  
                if (!borrarResponse.ok) {  
                    console.error('Error al borrar:', await borrarResponse.text());  
                    $('#presentacion-invitados .panel-loader').addClass('d-none'); 
                    return;
                }  
                console.log('Borrado completado:', await borrarResponse.text());
                let records = [];  
                // Recoger datos de los elementos ordenables

                lista.find('.p-elem-item').each(function() {  
                    const nombre = $(this).find('.row-input-nombre').val();  
                    const cargo = $(this).find('.row-input-cargo').val();  
                    const urldrive = $(this).find('.row-input-urldrive').val();
                    records.push([nombre, cargo, urldrive]);  
                });
                
                
                console.log(JSON.stringify(records));

                $('#presentacion-invitados .panel-loader').addClass('d-none'); // Ocultar loader 

                
                const crearResponse = await fetch(`${apiUrl}?action=crearNuevoOrdenPrsentacionInvitados&records=${JSON.stringify(records)}`);  
                if (!crearResponse.ok) {  
                    console.error('Error al crear nuevo orden:', await crearResponse.text());  
                } else {  
                    console.log('Nuevo orden creado con éxito:', await crearResponse.text());  
                }
            }  
        });  

        lista.disableSelection(); // Deshabilitar selección de texto  
        $('#presentacion-invitados .panel-loader').addClass('d-none'); // Ocultar loader al finalizar  
        lista.removeClass('d-none'); // Mostrar lista  
    } catch (error) {  
        console.error("Error al obtener registros:", error);  
        $('#presentacion-invitados .panel-loader').addClass('d-none'); // Ocultar loader en caso de error  
    }  
}

$(document).ready(function(){

    //LISTAR
    $(document).on('click', '.panel-lista-invitados .elem-item', function() {
        const checkbox = $(this).find('.form-check-input');
        // Alternar el estado de 'checked'
        const isChecked = !checkbox.prop('checked');
        checkbox.prop('checked', !checkbox.prop('checked'));

        // Cambiar el color de fondo basado en el estado del checkbox
        if (isChecked) {
            $(this).css('background-color', '#f0f8ff'); // Color de fondo cuando está seleccionado
        } else {
            $(this).css('background-color', ''); // Restaurar fondo a su estado original
        }
    });

    //ADICIONAR
    $('#page-lista-invitados #add').on('click', async function(event) {  
        event.preventDefault();  

        // Verificar si hay elementos seleccionados  
        if ($('.panel-lista-invitados .elem-item .form-check-input:checked').length === 0) {  
            alert('No has seleccionado ningún elemento.');  
        } else {  
            $('.go-panel-loader').removeClass('d-none');  

            // Recoger registros a enviar  
            let records = [];  

            // Iterar sobre los elementos seleccionados  
            $('.panel-lista-invitados .elem-item .form-check-input:checked').each(function() {  
                let nombre = $(this).closest('.elem-item').find('.field-nombre').text();  
                let cargo = $(this).closest('.elem-item').find('.field-cargo').text();  
                let url = $(this).closest('.elem-item').find('.foto').attr('data-src');

                // Con poner los registros como una cadena de texto en formato JSON para el URL  
                records.push([nombre, cargo, url]);  
            });  

            try {
                        
                console.log(JSON.stringify(records));
                        
                // Llamar al método doGet a través de GET  
                const deleteResponse = await fetch(`${apiUrl}?action=borrarAntesOrdenarPresentacionInvitados`);  

                if (!deleteResponse.ok) {  
                    throw new Error('Error al eliminar registros: ' + await deleteResponse.text());  
                }
                console.log(await deleteResponse.text()); // Para confirmar que se eliminó correctamente  

                // Llamar al método doGet con los registros como parámetro  
                const addResponse = await fetch(`${apiUrl}?action=crearNuevoOrdenPrsentacionInvitados&records=${JSON.stringify(records)}`);  

                if (!addResponse.ok) {  
                    throw new Error('Error al agregar registros: ' + await addResponse.text());  
                }

                // Obtener la respuesta y mostrarla  
                const result = await addResponse.text();  
                alert(result);  
                console.log(result); 
                LoadInternaPage('#presentacion-invitados');  

            } catch (error) {  
                console.error(error);  
                alert('Ha ocurrido un error: ' + error.message);  
            } finally {  
                $('.go-panel-loader').addClass('d-none'); // Esconder el loader al final  
            }  
        }  
    });

});