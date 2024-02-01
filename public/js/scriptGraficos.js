let myPieChart;

$(document).ready(() => {
    $.ajax({
        url: '/graficosInfo',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const cursosDropdown = $('#cursos');
            data.forEach(curso => {
                cursosDropdown.append($('<option>', {
                    value: curso.idCurso,
                    text: curso.nombreCurso
                }));
            });

            // Evento del botón para generar el gráfico
            $('#generarGrafico').on('click', function () {
                const cursoSeleccionado = cursosDropdown.val();
                const datosCurso = data.find(curso => curso.idCurso == cursoSeleccionado);

                if (datosCurso) {
                    renderizarGrafico(datosCurso);
                }
            });
        },
        error: function (error) {
            console.error('Error al cargar los datos:', error);
        }
    });
});

function renderizarGrafico(datosCurso) {
    // Destruir el gráfico existente si hay uno
    if (myPieChart) {
        myPieChart.destroy();
    }

    const ctxPie = document.getElementById('myPieChart').getContext('2d');
    myPieChart = new Chart(ctxPie, {
        type: 'doughnut', // Usar 'doughnut' en lugar de 'pie' para un efecto de pastel cerrado
        data: {
            labels: ['Aprobados', 'Suspensos'],
            datasets: [{
                data: [datosCurso.aprobados, datosCurso.totalMatriculados - datosCurso.aprobados],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '70%', // Agregar cutout para crear un efecto de pastel cerrado
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: `Ratio de Aprobados/Suspensos para ${datosCurso.nombreCurso}`
                }
            }
        }
    });
}
