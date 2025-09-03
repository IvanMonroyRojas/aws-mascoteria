# Mascotería Web (Monolítico en AWS)

Aplicación web monolítica desarrollada con **Node.js** y **Express**, conectada a una base de datos **MySQL** alojada en **Amazon RDS** y desplegada en una instancia **Amazon EC2**.  
Permite la gestión de mascotas y muestra la información del servidor activo.

<img width="781" height="887" alt="Diagrama drawio" src="https://github.com/user-attachments/assets/ec664952-6d83-4ac5-844b-39e5d0ae1561" />

## 🚀 Características
- Arquitectura monolítica.
- Conexión a MySQL en Amazon RDS.
- Despliegue en Amazon EC2 con seguridad configurada mediante **VPC Security Groups**.
- Endpoint `/api/server-info` para obtener el nombre/IP del servidor.
- Interfaz web estática servida desde Express.

## 🏗️ Arquitectura

La arquitectura incluye:
- **VPC con múltiples subnets**:
  - **Subnet pública**:  
    - Instancias **EC2** dentro de un **Auto Scaling Group** que hospedan la aplicación web.  
  - **Subnet privada**:  
    - **Amazon RDS (MySQL)** para almacenar la información de las mascotas.  

- **Elastic Load Balancer (ELB)**: Distribuye el tráfico entre múltiples instancias EC2.  

- **Auto Scaling Group (ASG)**: Ajusta automáticamente la cantidad de instancias según la carga.  

- **Amazon EC2**: Aloja la aplicación web.  

- **Amazon RDS (MySQL)**: Base de datos para almacenar la información de las mascotas.  

## Contenido

- [public/](public/) – Carpeta que contiene los archivos del frontend de la aplicación.
  - [index.html](public/index.html) – Página principal de la aplicación web.
  - [script.js](public/script.js) – Lógica de interacción con la API y manipulación del DOM.
  - [style.css](public/style.css) – Estilos y diseño de la página web.
- [database.sql](database.sql) – Script para crear la base de datos y la tabla Mascotas.
- [package.json](package.json) – Archivo de configuración de npm que define dependencias y scripts del proyecto.
- [package-lock.json](package-lock.json) – Archivo que asegura la instalación de versiones exactas de las dependencias.
- [server.js](server.js) – Servidor Node.js que maneja la API y la conexión a la base de datos.
- [local-setup.md](local-setup.md) – Guía paso a paso para levantar y probar la aplicación en entorno local con Docker y Node.js.
- [aws-deployment.md](aws-deployment.md) – Guía detallada de despliegue de la aplicación en AWS, incluyendo EC2, RDS, VPC, y configuración de seguridad.
- [README.md](README.md) – Documentación principal del proyecto, incluyendo descripción, estructura y pasos generales para iniciar la aplicación.

## 🛠️ Tecnologías
- **Node.js + Express**
- **MySQL (Amazon RDS)**
- **JavaScript (Frontend + Backend)**
- **Docker (Prueba local)**

## 🔑 Lecciones aprendidas
- Conexión entre EC2 y RDS mediante configuración de **Security Groups**.  
- Instalación de clientes MySQL en Amazon Linux 2023.  
- Despliegue de aplicaciones monolíticas en la nube.  
- Integración entre frontend y backend en un mismo servidor.  

---
💡 Proyecto realizado como práctica de despliegue en la nube y bases de datos gestionadas en AWS.
