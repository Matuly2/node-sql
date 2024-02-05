var cursos;
$(document).ready(() => {
    
    $.ajax({
        url: '/cursosInfo',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            cursos=data;
            
            renderCursos(data);
        },
        error: function(error) {
            console.error('Error al cargar los datos:', error);
        }
    });
});

function habilitarCampos() {
    const cursoSelect = document.getElementById('curso');
    const nombreInput = document.getElementById('nombre');
    const lugarInput = document.getElementById('lugar');
    const descripcionTextarea = document.getElementById('descripcion');
    const nivelSelect = document.getElementById('nivel');
    const enviarButton = document.getElementById('enviarButton');

    const isCursoSelected = cursoSelect.value !== "";

    nombreInput.disabled = !isCursoSelected;
    lugarInput.disabled = !isCursoSelected;
    descripcionTextarea.disabled = !isCursoSelected;
    nivelSelect.disabled = !isCursoSelected;

    enviarButton.disabled = !isCursoSelected;
}
function renderCursos(jsonData) {
    const cursoSelect = document.getElementById('curso');
    
    
    cursoSelect.innerHTML = '<option value="" disabled selected>Elige un curso para modificar</option>';

    
    jsonData.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso.nombreCurso;
        option.textContent = curso.nombreCurso;
        cursoSelect.appendChild(option);
    });
}
function modificar() {

    const cursoSelect = document.getElementById('curso');
    const nombreInput = document.getElementById('nombre');
    const lugarInput = document.getElementById('lugar');
    const descripcionTextarea = document.getElementById('descripcion');
    const nivelSelect = document.getElementById('nivel');
    if(cursoSelect.value&&nombreInput.value&&lugarInput.value&&descripcionTextarea.value&&nivelSelect.value){
    const valoresFormulario = {
        curso: cursoSelect.value,
        nombre: nombreInput.value,
        lugar: lugarInput.value,
        descripcion: descripcionTextarea.value,
        nivel: nivelSelect.value,
        numeroImagen: obtenerNumeroImagenSeleccionada()
    };

    
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción modificará el curso y no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, modificar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
       
        if (result.isConfirmed) {
            
            $.ajax({
                url: '/modificarCurso',
                type: 'PUT', 
                dataType: 'json',
                data: valoresFormulario, 
                success: function(data) {
                        
                    Swal.fire('Modificado', 'El curso ha sido modificado', 'success').then(() => {
                        borrarCampos();
                        location.reload();
                    
                        
                    });
                },
                error: function(error) {
                    console.error('Error al modificar el curso:', error);
                    Swal.fire('Error', 'No se pudo modificar al curso. Inténtelo de nuevo más tarde.', 'error');
                }
            });
        }
    });
}else{
    Swal.fire('Error', 'Rellene todos los campos.', 'error');
}

}
function borrarCampos(){
    document.getElementById('nombre').value="";
    document.getElementById('lugar').value="";
    document.getElementById('descripcion').value="";
    document.getElementById('nivel').value="";
}


let numeroImagenSeleccionada = null;

function seleccionarImagen(numero) {
    const checkMark = document.getElementById(`check${numero}`);
    const imagenItem = document.querySelector(`.imagen-item:nth-child(${numero})`);

    if (numeroImagenSeleccionada === numero) {
        // Si la misma imagen ya está seleccionada, deselecciónala
        numeroImagenSeleccionada = null;
        checkMark.style.display = 'none';
        imagenItem.classList.remove('selected');
    } else {
        // Desselecciona la imagen anterior
        if (numeroImagenSeleccionada !== null) {
            document.getElementById(`check${numeroImagenSeleccionada}`).style.display = 'none';
            document.querySelector(`.imagen-item:nth-child(${numeroImagenSeleccionada})`).classList.remove('selected');
        }

        // Selecciona la nueva imagen
        numeroImagenSeleccionada = numero;
        checkMark.style.display = 'block';
        imagenItem.classList.add('selected');
    }
}

// Puedes acceder al número de la imagen seleccionada en la función modificar()
function obtenerNumeroImagenSeleccionada() {
    return numeroImagenSeleccionada;
}
