function lista_de_invitados() {

    return `
    
    <main class="d-flex flex-column bg-black-50 vh-100">
        <section>

            <section class="panel-loader d-none d-flex flex-column justify-content-center align-items-center vh-100"
                style="background-color:rgba(255,255,255,0.8); position:fixed; top:0px; left:0px; width:100%;">
                <span class="spinner-border text-primary" role="status"></span>
                <span class="text-black-50">Cargando...</span>
            </section>

            <section class="lista-invitados d-flex flex-column d-none border-end" style="width: 90%;">
            </section>

        </section>
    </main>

    `;

}

function nuevo_invitado() {
    return `
    
    <main>
        <form>

            <section class="form-panel d-flex flex-column gap-3 p-3">
            <div class="d-flex flex-column">
                <label class="form-label text-black-50">Nombre:*</label>
                <input id="nombre" class="border rounded-0 p-2 text-black-50" type="text" />
                <span class="d-none" style="color:red; font-size:9px;">Este campo es obligatorio</span>
            </div>

            <div class="d-flex flex-column">
                <label class="form-label text-black-50">Cargo:*</label>
                <input id="cargo" class="border rounded-0 p-2 text-black-50" type="text" />
                <span class="d-none" style="color:red; font-size:9px;">Este campo es obligatorio</span>
            </div>

            <div class="d-flex flex-column">
                <label class="form-label text-black-50">Red Social:*</label>
                <section class="d-flex align-items-center border rounded-0 p-2">
                <div class="text-black-50">@</div>
                <input id="redSocial" class="border-0 w-100 text-black-50" type="text" />
                </section>
                <span class="d-none" style="color:red; font-size:9px;">Este campo es obligatorio</span>
            </div>

            <div class="d-flex flex-column">
                <label class="form-label text-black-50">Ubicación:*</label>
                <input id="ubicacion" class="border rounded-0 p-2 text-black-50" type="text" />
                <span class="d-none" style="color:red; font-size:9px;">Este campo es obligatorio</span>
            </div>
            <script>
                $(document).ready(function () {
                $('#tema').on('input', function () {
                    let count = $(this).val().length;
                    $('#add-caracteres').text(count+'/65');
                    if (count > 65) {
                    $(this).val($(this).val().substring(0, 65));
                    }
                });
                });  
            </script>
            <div class="d-flex flex-column">
                <label class="d-flex justify-content-between form-label text-black-50">
                <div>Tema del Invitado:*</div>
                <div id="add-caracteres" class="">0/65</div>
                </label>
                <!--<input id="tema" class="border rounded-0 p-2 text-black-50" type="text" />-->
                <textarea id="tema" class="border rounded-0 p-2 text-black-50"></textarea>
                <span class="d-none" style="color:red; font-size:9px;">Este campo es obligatorio</span>
            </div>

            <div class="d-flex flex-column gap-3">
                <div>
                <label class="form-label text-black-50">Foto:*</label>
                </div>
                <input id="fileInput" class="input-file d-none" type="file" accept="image/*" />
                <span class="d-none" style="color:red; font-size:9px;">Este campo es obligatorio</span>

                <section class="d-inline-flex gap-2">
                <div class="fondo-img panel-foto border rounded-0"
                    style="width: 100px; height: 100px; background-image: url(''); background-size: cover; background-position: center;">
                    <img class="image-foto d-none" src="" width="100" height="80" />
                </div>

                <div class="d-flex flex-column gap-2 align-items-baseline">
                    <button class="btn-image btn-subir btn btn-sm btn-primary d-flex align-items-center gap-2" type="button">
                    <i class="fas fa-upload"></i>
                    </button>
                    <!--<button class="btn-image btn-borrar-foto btn btn-sm btn-primary d-flex align-items-center gap-2"
                    type="button" disabled>
                    <i class="fas fa-trash"></i>
                    </button>-->
                    <!--<button class=" btn-image btn-recortar btn btn-sm btn-primary d-flex align-items-center gap-2" type="button"
                    disabled>
                    <i class="fas fa-cut"></i>
                    </button>-->
                </div>
                </section>
            </div>

            <section class="panel-cropper d-none"
                style="z-index:1000; position:fixed; left:0px; top:0px; width:100%; height:100vh; background-color:rgba(255,255,255,1.0)">

                <div class="panel-img" style="max-width: 100%; max-height: 90%; overflow: hidden;"></div>

                <div class="d-flex justify-content-between bg-black p-3">
                <button class="btn-guardar-recorte btn btn-success d-flex align-items-center gap-2" type="button">
                    <i class="fas fa-save"></i>Guardar Recorte
                </button>

                <button class="btn-cancelar-recorte btn btn-danger d-flex align-items-center gap-2" type="button">
                    <i class="fas fa-save"></i>Cancelar
                </button>

                </div>

            </section>

            </section>

            <section class="d-flex justify-content-end p-2"
            style="position: sticky;width: 100%;left: 0px;bottom: 0px;background-color: #eee;">
            <button class="btn-guardar btn btn-success d-flex align-items-center gap-2" type="button">
                <i class="fas fa-save"></i>Guardar
            </button>
            </section>

        </form>

        <section class="panel-loader-add d-none d-flex flex-column justify-content-center align-items-center vh-100"
            style="background-color:rgba(255,255,255,0.8); position:fixed; top:0px; left:0px; width:100%;">
            <span class="spinner-border text-primary" role="status"></span>
            <span class="text-black-50">Procesando Operacion...</span>
        </section>

        </main>

        <script src="./js/nuevo_invitado.js"></script>

    `;
}

function editar_invitado(){
    return `        
        <main>
            <form>

                <section class="form-panel d-flex flex-column gap-3 p-3">
                    <div class="d-flex flex-column">
                        <label class="form-label text-black-50">Nombre:*</label>
                        <input id="edit-oldnombre" type="hidden" />
                        <input id="edit-nombre" class="border rounded-0 p-2 text-black-50" type="text" />
                        <span class="d-none" style="color:red; font-size:9px;">Este campo es obligatorio</span>
                    </div>

                    <div class="d-flex flex-column">
                        <label class="form-label text-black-50">Cargo:*</label>
                        <input id="edit-cargo" class="border rounded-0 p-2 text-black-50" type="text" />
                        <span class="d-none" style="color:red; font-size:9px;">Este campo es obligatorio</span>
                    </div>

                    <section class="d-flex align-items-center border rounded-0 p-2">
                        <div class="text-black-50">@</div>
                        <input id="edit-redSocial" class="border-0 w-100 text-black-50" type="text" />
                    </section>

                    <div class="d-flex flex-column">
                        <label class="form-label text-black-50">Ubicación:*</label>
                        <input id="edit-ubicacion" class="border rounded-0 p-2 text-black-50" type="text" />
                        <span class="d-none" style="color:red; font-size:9px;">Este campo es obligatorio</span>
                    </div>

                    <script>
                        $(document).ready(function () {
                            $('#edit-tema').on('input', function () {
                                let count = $(this).val().length;
                                $('#edit-caracteres').text(count+'/65');
                                if (count > 65) {
                                    $(this).val($(this).val().substring(0, 65));
                                }
                            });
                        });  
                    </script>

                    <div class="d-flex flex-column">
                        <label class="d-flex justify-content-between form-label text-black-50">
                            <div>Tema del Invitado:*</div>
                            <div id="edit-caracteres">0/65</div>
                        </label>
                        <!--<input id="edit-tema" class="border rounded-0 p-2 text-black-50" type="text" />-->
                        <textarea id="edit-tema" class="border rounded-0 p-2 text-black-50"></textarea>
                        <span class="d-none" style="color:red; font-size:9px;">Este campo es obligatorio</span>
                    </div>

                    <div class="d-flex flex-column gap-3">
                        <div>
                            <label class="form-label text-black-50">Foto:*</label>
                        </div>
                        <input id="edit-fileInput" class="edit-input-file d-none" type="file" accept="image/*" />
                        <span class="d-none" style="color:red; font-size:9px;">Este campo es obligatorio</span>

                        <section class="d-inline-flex gap-2">
                            <div class="fondo-img edit-panel-foto border rounded-0"
                                style="width: 100px; height: 100px; background-image: url(''); background-size: cover; background-position: center;">
                                <img class="edit-image-foto d-none" src="" width="100" height="80" />
                            </div>

                            <div class="d-flex flex-column gap-2 align-items-baseline">
                                <button class="btn-image edit-btn-subir btn btn-sm btn-primary d-flex align-items-center gap-2"
                                    type="button">
                                    <i class="fas fa-upload"></i>
                                </button>
                            </div>
                        </section>

                    </div>

                    <section class="edit-panel-cropper d-none"
                        style="z-index:1000; position:fixed; left:0px; top:0px; width:100%; height:100vh; background-color:rgba(255,255,255,1.0)">

                        <div class="edit-panel-img" style="max-width: 100%; max-height: 90%; overflow: hidden;"></div>

                        <div class="d-flex justify-content-between bg-black p-3">
                            <button class="edit-btn-guardar-recorte btn btn-success d-flex align-items-center gap-2"
                                type="button">
                                <i class="fas fa-save"></i>Guardar Recorte
                            </button>

                            <button class="edit-btn-cancelar-recorte btn btn-danger d-flex align-items-center gap-2"
                                type="button">
                                <i class="fas fa-save"></i>Cancelar
                            </button>

                        </div>

                    </section>

                </section>

                <section class="d-flex justify-content-end p-2"
                    style="position: sticky;width: 100%;left: 0px;bottom: 0px;background-color: #eee;">
                    <button class="edit-btn-guardar btn btn-success d-flex align-items-center gap-2" type="button">
                        <i class="fas fa-save"></i>Realizar Cambios
                    </button>
                </section>

            </form>

            <section class="edit-panel-loader-add d-none d-flex flex-column justify-content-center align-items-center vh-100"
                style="background-color:rgba(255,255,255,0.8); position:fixed; top:0px; left:0px; width:100%;">
                <span class="spinner-border text-primary" role="status"></span>
                <span class="mensaje-operacion text-black-50">Procesando Operacion...</span>
            </section>

        </main>

        <script src="./js/editar_invitado.js"></script>
    `;
}