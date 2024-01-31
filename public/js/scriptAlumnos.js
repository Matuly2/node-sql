$(document).ready(() => {
    $.ajax({
        url: '/alumnosInfo',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            
            render(data);
        },
        error: function(error) {
            console.error('Error al cargar los datos:', error);
        }
    });
});

function render(data) {
    const alumnoContainer = document.getElementById("alumnoContainer");

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
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'custom-popup-class',
                },
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
