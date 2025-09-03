# Configuración y Pruebas en Entorno Local

Este documento describe cómo se preparó el entorno local para el desarrollo y prueba de la aplicación "Mascotería".  
El objetivo es garantizar que la aplicación funcione correctamente en un entorno local antes de su despliegue en la nube.

## Levantando la base de datos en Docker

El primer paso para crear la aplicación y realizar pruebas locales fue levantar un contenedor Docker con MySQL. Esto permite tener un entorno aislado y reproducible para la base de datos, sin necesidad de instalar MySQL directamente en la máquina.

Se utilizó el siguiente comando en **CMD** o en la terminal de Windows:

```bash
docker run --name mascoteria-db -e MYSQL_ROOT_PASSWORD=pass123 -p 3307:3306 -d mysql:8
```
Explicación de los parámetros:

--name mascoteria-db: Asigna un nombre al contenedor para identificarlo fácilmente.

-e MYSQL_ROOT_PASSWORD=pass123: Define la contraseña del usuario root de MySQL.

-p 3307:3306: Mapea el puerto 3306 del contenedor al puerto 3307 del host, permitiendo acceder a la base de datos desde la máquina local.

-d mysql:8: Ejecuta el contenedor en modo "desprendido" (detached) utilizando la imagen oficial de MySQL versión 8.

<img width="921" height="74" alt="image" src="https://github.com/user-attachments/assets/f88eb8a2-bcf1-4769-9416-c2742d8ee3b5" />

## Creción del modelo de datos

A continuación, se accede a la base de datos utilizando **Visual Studio Code** junto con la extensión **SQLTools**.  
Se crea una instancia de conexión a la base de datos MySQL y, dentro de ella, se crea la tabla **`Mascotas`** para almacenar la información de los registros.  

> 💡 La definición completa de la base de datos y la tabla se encuentra en el archivo [`database.sql`](./database.sql) incluido en este repositorio.

<img width="921" height="217" alt="image" src="https://github.com/user-attachments/assets/480163c7-0314-4f8b-b6bc-5fdd1f902317" />

## Levantar la app web

Se desarrolla una aplicación web sencilla para gestionar la información de las mascotas, conectándose a la base de datos MySQL alojada en Docker.  

Todos los archivos necesarios para la aplicación se encuentran en este repositorio, incluyendo:

- `server.js` – Servidor Node.js que maneja las rutas de la API.
- `package.json` y `package-lock.json` – Dependencias del proyecto.
- Carpeta `public/` – Archivos estáticos del frontend (`index.html`, `script.js`, `style.css`).

Cambios necesarios para ejecutar en local

De forma predeterminada, el archivo server.js está configurado para conectarse a la base de datos en Amazon RDS.
Para ejecutar la aplicación en un entorno local con Docker, es necesario actualizar la configuración de conexión en server.js:

- Cambiar el host a 127.0.0.1 o localhost.

- Usar el port 3307 (mapeado en el contenedor).

- Cambiar el user a root.

- Cambiar la password a la definida en el contenedor (pass123).

- Ejemplo de configuración local:

```bash
const dbConfig = {
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: 'pass123',
    database: 'MascoteriaDB'
};
```

Ejecución de la aplicación

1. Instalar las dependencias del proyecto ejecutando:

```bash
npm install
```
2.Iniciar el servidor Node.js con:
```bash
node server.js
```
3. Abrir el navegador y acceder a:

```bash
http://localhost
```
💡 Asegúrate de que el contenedor de MySQL esté corriendo y accesible antes de iniciar la aplicación.

<img width="921" height="637" alt="image" src="https://github.com/user-attachments/assets/7fe3466b-2fb5-42b7-baaa-3c7d46433d01" />

Una vez que la aplicación esté corriendo y la base de datos MySQL en Docker esté activa, ahora es posible ingresar nuevas mascotas directamente desde la interfaz web.  

Los datos que se ingresen a través del formulario en la página serán almacenados automáticamente en la base de datos `MascoteriaDB` dentro de la tabla `Mascotas`.  

Esto permite gestionar fácilmente la información de cada mascota, incluyendo su nombre, tipo, edad y raza.
