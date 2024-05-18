    //FUNCION QUE BUSCA EL PERSONAJE EN UNA APIs Y LA ALMACENA ATRIBUTOS O VARIABLES
    function buscarPersonaje(codigoPersonaje) {
        $.ajax({
            dataType: "json",
            type: "get",
            url: "https://www.superheroapi.com/api.php/4905856019427443/" + codigoPersonaje,
            success: (resultado) => {
                let nombre = resultado.name;
                let fullName = resultado.biography['full-name'];
                let placeOfBirth = resultado.biography['place-of-birth'];
                let firstAppearance = resultado.biography['first-appearance'];
                let publisher = resultado.biography['publisher'];
                let alignment = resultado.biography['alignment'];
                let conexiones_grupo = resultado.connections['group-affiliation'];
                let conexiones_relativas = resultado.connections['relatives'];
                let ulr_imagen = resultado.image.url;
                let alias = resultado.biography.aliases;
                //METODO JOIN CREA UNA CADENA DE TEXTOS SEPARADA POR COMA
                let html_alias = alias.join(", ");

                //ESTRUCTURA DEL HTML QUE SE MOSTRARÁ UNA VEZ QUE SE EJECUTE LA APP
                let html_datos = `
                    <div class="container mt-5">
                        <div class="row">
                            <div class="col-md-6">
                                <img src="${ulr_imagen}" alt="${nombre}" class="img-fluid">
                            </div>
                            <div class="col-md-6">
                                <h1 class="mb-4">${nombre}</h1>
                                <p><strong>Full Name:</strong> ${fullName}</p>
                                <p><strong>Aliases:</strong> ${html_alias}</p>
                                <p><strong>Place of Birth:</strong> ${placeOfBirth}</p>
                                <p><strong>First Appearance:</strong> ${firstAppearance}</p>
                                <p><strong>Publisher:</strong> ${publisher}</p>
                                <p><strong>Alignment:</strong> ${alignment}</p>
                                <div id="powerstatsChart"></div>
                            </div>
                        </div>
                    </div>
                `;
                //FUNCIÓN QUE MUESTRA EL PERSONAJE EN EL HTML
                $('#personaje').html(html_datos);
                //AHORA CREAREMOS EL GRAFICO CON LAS HABILIDADES
                let stats = resultado.powerstats;
                if (Object.values(stats).every(value => value === "null")) {
                    $('#powerstatsChart').html("<p>No tiene estadísticas conocidas.</p>");
                } else {
                    let dataPoints = [
                        { y: stats.intelligence, label: "Intelligence" },
                        { y: stats.strength, label: "Strength" },
                        { y: stats.speed, label: "Speed" },
                        { y: stats.durability, label: "Durability" },
                        { y: stats.power, label: "Power" },
                        { y: stats.combat, label: "Combat" }
                    ];

                    let chart = new CanvasJS.Chart("powerstatsChart", {
                        animationEnabled: true,
                        title: {
                            text: `Estadísticas de Poder de ${nombre}`
                        },
                        data: [{
                            type: "pie",
                            startAngle: 240,
                            yValueFormatString: "##0\"%\"",
                            indexLabel: "{label} {y}",
                            dataPoints: dataPoints
                        }]
                    });

                    chart.render();
                }
            },
            error: () => {
                alert("Error al buscar el personaje");
            }
        });
    }
    //CONDICION DE BUSQUEDA
    $('#formBusqueda').on('submit', (event) => {
        event.preventDefault();
        $("#personaje").html("");
        let idPersonaje = $('#codigoPersonaje').val();
        //ESTABLECE QUE LOS NUMEROS SON ENTRE 1 Y 731
        if (!$.isNumeric(idPersonaje) || idPersonaje < 1 || idPersonaje > 731) {
            alert("Por favor, ingresa un número válido entre 1 y 731.");
            return;
        }

        buscarPersonaje(parseInt(idPersonaje));
    });