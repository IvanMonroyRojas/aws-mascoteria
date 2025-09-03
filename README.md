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

## 🛠️ Tecnologías
- **Node.js + Express**
- **MySQL (Amazon RDS)**
- **JavaScript (Frontend + Backend)**

## 🔑 Lecciones aprendidas
- Conexión entre EC2 y RDS mediante configuración de **Security Groups**.  
- Instalación de clientes MySQL en Amazon Linux 2023.  
- Despliegue de aplicaciones monolíticas en la nube.  
- Integración entre frontend y backend en un mismo servidor.  

---
💡 Proyecto realizado como práctica de despliegue en la nube y bases de datos gestionadas en AWS.
