$(document).ready(() => {
    $.ajax({
        url: '/cursosInfo',
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
    const cursoContainer = document.getElementById("cursoContainer");

    data.forEach(curso => {
        const card = document.createElement("div");
        card.classList.add("curso-card");

        const img = document.createElement("img");
        img.src = "../img/curso.jpg"; 
        img.alt = curso.nombreCurso;

        const info = document.createElement("div");
        info.classList.add("curso-info");
        info.innerHTML = `<p><strong>Ubicación:</strong> ${curso.ubicacionCurso}</p><p><strong>Nivel:</strong> ${curso.nivel}</p><p><strong>Centros:</strong> ${parseCentrosImpartidos(curso.centrosImpartidos)}</p>`;

        const name = document.createElement("div");
        name.classList.add("curso-name");
        name.innerHTML = curso.nombreCurso;

        card.appendChild(img);
        card.appendChild(info);
        card.appendChild(name);

        card.addEventListener("click", function () {
            showCourseDetails(curso)
        });

        function showCourseDetails(curso) {
            Swal.fire({
                title: curso.nombreCurso,
                html: `<p><strong>Ubicación:</strong> ${curso.ubicacionCurso}</p><p><strong>Nivel:</strong> ${curso.nivel}</p><p><strong>Centros:</strong> ${parseCentrosImpartidos(curso.centrosImpartidos)}</p>`,
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'custom-popup-class',
                },
            });
        }

        cursoContainer.appendChild(card);
    });
}

function parseCentrosImpartidos(centrosImpartidos) {
    // Convierte la cadena JSON de centros a un array y formatea
    const centrosArray = JSON.parse(centrosImpartidos);
    return centrosArray.join(", ");
}
