var cursos;
$(document).ready(() => {
    $.ajax({
        url: '/cursosInfo',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            cursos=data;
            console.log(data);
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
    
    // Limpiar desplegable antes de renderizar
    cursoSelect.innerHTML = '<option value="" disabled selected>Elige un curso para modificar</option>';

    // Renderizar opciones desde el JSON
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
        nivel: nivelSelect.value
    };

    console.log(valoresFormulario); // Puedes mostrarlo en la consola o realizar otras operaciones
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
        // Si se confirma la modificación
        if (result.isConfirmed) {
            
            $.ajax({
                url: '/modificarCurso',
                type: 'GET', 
                dataType: 'json',
                data: valoresFormulario, 
                success: function(data) {
                    // Lógica de éxito después de modificar
                    Swal.fire('Modificado', 'El curso ha sido modificado', 'success');
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