# scraper-notas

Este proyecto utiliza [Puppeteer](https://pptr.dev/) para automatizar el proceso de inicio de sesión en el sistema de estudiantes de [UMAS](https://umas.ipss.cl), acceder a la sección de concentración de notas, extraer la información y guardarla en un archivo CSV con el nombre del usuario.

## Características

- Automatiza el inicio de sesión en la página de estudiantes de UMAS.
- Navega a la sección de concentración de notas.
- Extrae información de las notas en formato tabular.
- Genera un archivo CSV con el nombre del usuario y el sufijo `-notas`.

## Requisitos

Antes de comenzar, asegúrate de tener instalados:

- [Node.js](https://nodejs.org/) (versión 14 o superior).
- npm (incluido con Node.js).
- Acceso al sistema de estudiantes de UMAS ([https://umas.ipss.cl](https://umas.ipss.cl)).

## Instalación

1. Clona este repositorio:

    ```bash
    git clone https://github.com/tu-usuario/scraper-notas.git
    cd scraper-notas
    ```

2. Instala las dependencias necesarias:

    ```bash
    npm install puppeteer
    ```

## Uso

1. Abre el archivo `scraper.js` y actualiza las credenciales de usuario con tu correo y contraseña:

    ```javascript
    const USERNAME = "tu_correo@example.com";
    const PASSWORD = "tu_contraseña";
    ```

2. Ejecuta el script:

    ```bash
    node scraper.js
    ```

3. Una vez que el script finalice, se generará un archivo CSV con el formato `<NombreUsuario>-notas.csv` en el directorio raíz del proyecto.

    Por ejemplo, si tu nombre es "Juan Pérez", el archivo generado será `Juan-notas.csv`.

## Estructura del Proyecto

```plaintext
scraper-notas/
├── scraper.js       # Script principal que realiza el scraping
├── README.md        # Documentación del proyecto
├── package.json     # Dependencias del proyecto
└── notas.csv        # Archivo generado con las notas