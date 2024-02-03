var alumnos;

$(document).ready(() => {
    $.ajax({
        url: '/alumnosInfo',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            alumnos=data;
            render(data);
            console.log(data)
            
        },
        error: function(error) {
            console.error('Error al cargar los datos:', error);
        }
    });
});

function render(data) {
    const alumnoContainer = document.getElementById("alumnoContainer");
    if(alumnoContainer!=null){
        alumnoContainer.innerHTML = "";
    }
    data.forEach(alumno => {
        const card = document.createElement("div");
        card.classList.add("alumno-card");

        const img = document.createElement("img");
        img.src = "../img/alumno.png"; 
        img.alt = alumno.nombreAlumno;

        const name = document.createElement("div");
        name.classList.add("alumno-name");
        name.innerHTML = `<p>${alumno.nombreAlumno}</p>`;

        const info = document.createElement("div");
        info.classList.add("alumno-info");
        info.innerHTML = parseCursosMatriculados(alumno.cursosMatriculados);

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(info);

        info.style.display = "none"; 

        card.addEventListener("mouseenter", function () {
            info.style.display = "block";
        });

        card.addEventListener("mouseleave", function () {
            info.style.display = "none";
        });

        card.addEventListener("click", function () {
            showAlumnoDetails(alumno);
        });

        function showAlumnoDetails(alumno) {
            Swal.fire({
                title: alumno.nombreAlumno,
                html: parseCursosMatriculados(alumno.cursosMatriculados),
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: 'Cerrar',
                cancelButtonText: 'Eliminar',
                cancelButtonColor:'#d33',
                 
                customClass: {
                    popup: 'custom-popup-class',
                },
            }).then((result) => {
                // Si se hace clic en "Eliminar"
                if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: 'Esta acción no se puede deshacer',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33', // Color rojo
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar',
                    }).then((result) => {
                        // Si se confirma la eliminación
                        
                        if (result.isConfirmed) {
                            $.ajax({
                                url: '/borrarAlumno',
                                type: 'GET', 
                                dataType: 'json',
                                data: { idAlumno: alumno.idAlumno }, 
                                success: function(data) {
                                    $.ajax({
                                        url: '/alumnosInfo',
                                        type: 'GET',
                                        dataType: 'json',
                                        success: function(data) {
                                            alumnos=data;
                                            render(data);
                                        },
                                        error: function(error) {
                                            console.error('Error al cargar los datos:', error);
                                        }
                                    });
                                    // Aquí puedes realizar la lógica de eliminación
                                    
                                    Swal.fire('Eliminado', 'El alumno ha sido eliminado', 'success');
                                },
                                error: function(error) {
                                    console.error('Error al borrar el alumno:', error);
                                }
                            });
                            
                         
                        }else{
                            Swal.fire('Error', 'No se pudo eliminar al alumno. Inténtelo de nuevo más tarde.', 'error');
                        }
                    });
                }
            });
        }
        
        

        alumnoContainer.appendChild(card);
    });
}

function parseCursosMatriculados(cursosMatriculados) {
    const cursosArray = JSON.parse(cursosMatriculados);
    let cursosHTML = "";

    cursosArray.forEach(curso => {
        cursosHTML += `<p><strong>${curso.nombreCurso}:</strong> ${curso.estado}</p>`;
    });

    return cursosHTML;
}
