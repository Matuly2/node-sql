$(document).ready(() => {
    $.ajax({
        url: '/centrosInfo',
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
    const centroContainer = document.getElementById("centroContainer");

    data.forEach(centro => {
        const card = document.createElement("div");
        card.classList.add("centro-card");

        const img = document.createElement("img");
        if(centro.img==null){
            img.src = "../img/centros/centro.jpg"; 
        }else{
            img.src = `../img/centros/${centro.img}.png`; 
        }
        
        img.alt = centro.nombreCentro;

        const info = document.createElement("div");
        info.classList.add("centro-info");
        info.innerHTML = `<p>🆔<span><strong>ID:</span> </strong>${centro.idCentro}</p><p>📘<span><strong>Cursos Impartidos:</strong></span> ${parseCursosImpartidos(centro.cursosImpartidos)}</p>`;

        const name = document.createElement("div");
        name.classList.add("centro-name");
        name.innerHTML = centro.nombreCentro;

        card.appendChild(img);
        card.appendChild(info);
        card.appendChild(name);

        card.addEventListener("click", function () {
            showCenterDetails(centro);
        });

        function showCenterDetails(centro) {
            Swal.fire({
                title: centro.nombreCentro,
                html: `<p><strong>ID Centro:</strong> ${centro.idCentro}</p><p><strong>Cursos Impartidos:</strong> ${parseCursosImpartidos(centro.cursosImpartidos)}</p>`,
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'custom-popup-class',
                },
            });
        }

        centroContainer.appendChild(card);
    });
}

function parseCursosImpartidos(cursosImpartidos) {
    // Convierte la cadena JSON de cursos a un array y formatea
    const cursosArray = JSON.parse(cursosImpartidos);
    return cursosArray.join(", ");
}
