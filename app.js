const buscador = document.getElementById("buscar");
const paisNombreInput = document.getElementById("paisNombre");
const cartaPais = document.getElementById("cartaPais");
const errorMessage = document.getElementById("error");

// Elementos para mostrar la info del país
const banderaPais = document.getElementById("banderaPais");
const nombreOficialPais = document.getElementById("nombreOficialPais");
const capitalPais = document.getElementById("capitalPais");
const poblacionPais = document.getElementById("poblacionPais");
const regionPais = document.getElementById("regionPais");
const monedaPais = document.getElementById("monedaPais");

buscador.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Obtener el nombre del país
    const nombrePais = paisNombreInput.value.trim();
    cartaPais.classList.add("hidden");
    errorMessage.classList.add("hidden");

    if (!nombrePais) {
        displayError("Por favor, introduzca un nombre de país.");
        return;
    }

    try {
        // Nueva URL de la API: buscar por nombre común
        const response = await fetch(`https://restcountries.com/v3.1/name/${nombrePais}?fullText=true`);
        
        if (!response.ok) {
            // Maneja el error 404 (Not Found) o cualquier otro error HTTP
            if (response.status === 404) {
                 throw new Error(`No se encontró el país "${nombrePais}".`);
            }
            throw new Error(`Error al buscar el país: ${response.status} ${response.statusText}`);
        }
        
        // La API devuelve un array de resultados
        const dataArray = await response.json();

        // **Filtro adicional para asegurar que el país hable español**
        const paisEnEspanol = dataArray.find(pais => pais.languages && pais.languages.hasOwnProperty('spa'));

        if (!paisEnEspanol) {
            throw new Error(`El país "${nombrePais}" no tiene el español como idioma principal.`);
        }

        displayCountryData(paisEnEspanol);

    } catch (error) {
        displayError(error.message);
    }
});

function displayCountryData(data) {
    // La data de la API de restcountries es un poco más compleja:

    // Bandera: usa la propiedad 'flags.svg'
    banderaPais.src = data.flags.svg;

    // Nombre Oficial: usa la propiedad 'name.official'
    nombreOficialPais.textContent = data.name.official;

    // Capital: es un array, tomamos el primer elemento (o 'N/A' si no existe)
    capitalPais.textContent = data.capital ? data.capital[0] : 'N/A';

    // Población: formateada para mejor lectura (separador de miles)
    poblacionPais.textContent = data.population.toLocaleString('es-ES');

    // Región
    regionPais.textContent = data.region;
    
    // Moneda: es un objeto, tomamos la clave del primer elemento del objeto 'currencies'
    let moneda = 'N/A';
    if (data.currencies) {
        // Obtiene la clave de la primera moneda (ej: ARS, COP, MXN)
        const codigoMoneda = Object.keys(data.currencies)[0]; 
        moneda = `${data.currencies[codigoMoneda].name} (${codigoMoneda})`;
    }
    monedaPais.textContent = moneda;

    cartaPais.classList.remove("hidden");
}

function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}