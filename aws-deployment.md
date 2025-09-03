# Despliegue en AWS

Una vez que la aplicación ha sido probada y funciona correctamente en el entorno local, el siguiente paso es desplegarla en la nube utilizando Amazon Web Services (AWS). 

Este documento detalla el paso a paso para levantar la infraestructura necesaria, incluyendo la creación de instancias EC2 para la aplicación web, la configuración de Amazon RDS para la base de datos MySQL, la definición de VPC con subnets públicas y privadas, y la configuración de seguridad y balanceo de carga. Además, se incluyen buenas prácticas para asegurar que la aplicación sea accesible y escalable en un entorno de producción.

## Creación de la VPC y Subnets

Utilizando la opción nativa de AWS **“VPC and more”**, se creó la VPC llamada `mascoteria-vpc`.  

Dentro de esta VPC se configuraron:  
- **2 subnets públicas**: para alojar las instancias EC2 que ejecutarán la aplicación web.  
- **2 subnets privadas**: donde se desplegará la base de datos RDS (MySQL).  
- **Tablas de ruta (Route Tables)**: configuradas para que las subnets públicas tengan acceso a Internet mediante el Internet Gateway, mientras que las subnets privadas permanecen aisladas.  
- **Internet Gateway (IGW)**: asociado a las subnets públicas para permitir la comunicación hacia y desde Internet.  

Esta configuración garantiza que la aplicación web pueda ser accesible públicamente mientras que la base de datos permanece segura dentro de la red privada.

<img width="918" height="318" alt="image" src="https://github.com/user-attachments/assets/c599862a-0b0d-4c4e-bf11-bb9443f55aee" />
<img width="698" height="256" alt="image" src="https://github.com/user-attachments/assets/60a9b19d-e16c-4fa0-b67a-d89f0c4c9e4e" />

## Configuración del Security Group Público

Se crea un **Security Group** asociado a las subnets públicas para controlar el acceso a las instancias EC2:  

- **Tráfico HTTP (puerto 80)**: abierto a todo el mundo (`0.0.0.0/0`) para que la aplicación web sea accesible públicamente.  
- **Tráfico SSH (puerto 22)**: restringido únicamente a mi dirección IP, permitiendo la administración segura del servidor sin exponerlo a Internet.  

Esta configuración asegura que la web sea accesible mientras que el servidor sigue protegido frente a accesos no autorizados.
<img width="921" height="129" alt="image" src="https://github.com/user-attachments/assets/3547be44-38a1-4164-a64a-dbb9d63f36e8" />

## Configuración del Security Group Privado

Se crea un **Security Group** asociado a las subnets privadas, destinado a las instancias de **Amazon RDS (MySQL)**:  

- **Acceso restringido** únicamente a los componentes que pertenecen al **Security Group público** (las EC2 de la aplicación web).  
- Esto permite que las instancias de EC2 puedan conectarse a la base de datos, mientras que la RDS no queda expuesta públicamente a Internet.  

Esta configuración garantiza la seguridad de los datos, limitando el acceso únicamente a los servidores que necesitan interactuar con la base de datos.

<img width="921" height="115" alt="image" src="https://github.com/user-attachments/assets/01097101-698c-4e7b-91cc-514e8d472746" />

## Creación de la DB Subnet Group para RDS

Para desplegar un **RDS MySQL** en una **subnet privada**, es necesario crear un **DB Subnet Group**:  

- Se seleccionan las **dos subnets privadas** que ya fueron creadas en la VPC.  
- Esto asegura que la instancia de RDS se lance únicamente dentro de estas subnets privadas, manteniéndola aislada de acceso público.  
- La DB Subnet Group funciona como un contenedor lógico que indica a RDS en qué subnets puede desplegarse.
<img width="921" height="126" alt="image" src="https://github.com/user-attachments/assets/ecbe6cfa-93bf-4030-a78d-4dccee50a1d1" />

## Creación de la base de datos RDS MySQL

Se despliega una instancia de **Amazon RDS MySQL** llamada **mascoteriadb** dentro de una de las **subnets privadas** definidas en la VPC.  

- La base de datos queda aislada del acceso público.  
- Sólo los recursos que pertenezcan al **Security Group privado** podrán conectarse a ella, garantizando la seguridad y el control de acceso.  
- Esta instancia almacenará toda la información de la aplicación, como los registros de mascotas y sus detalles.

<img width="921" height="126" alt="image" src="https://github.com/user-attachments/assets/6c02d974-2291-4a1b-aedd-dc6807f8da67" />

## Creación de la instancia EC2 con conexión al RDS

Se despliega una **instancia EC2** que alojará el **servidor web** de la aplicación.  

- La instancia se ubica en una **subnet pública** para poder ser accesible desde internet.  
- Gracias al **Security Group privado**, la instancia puede conectarse a la **base de datos RDS** (mascoteriadb) ubicada en la subnet privada.  
- Se utiliza **SSH** con clave privada para la administración segura del servidor.
<img width="921" height="170" alt="image" src="https://github.com/user-attachments/assets/a55bcb77-06d5-4d9d-9fc9-4a65cbbf137a" />

## Acceso al servidor web mediante SSH

Para configurar la instancia EC2, se accede al servidor usando una **terminal Bash**.  

1. Ubicarse en la carpeta donde se encuentra el archivo de claves generado al crear la instancia EC2.  
2. Ejecutar el siguiente comando:

```bash
ssh -i "<archivo_claves.pem>" ec2-user@<ip_pública_EC2>
```

Ejemplo:
```bash
ssh -i "server-web-8agosto.pem" ec2-user@52.90.62.115
```

## Instalación del cliente MySQL en EC2

Para conectarse al RDS MySQL desde la instancia EC2, primero se debe instalar el cliente de MySQL. Los pasos son los siguientes:

1. **Descargar el archivo comprimido del cliente MySQL:**

```bash
wget https://downloads.mysql.com/archives/get/p/23/file/mysql-8.0.41-linux-glibc2.28-x86_64.tar.xz
```

2. **Extraer el contenido del archivo:**

```bash
wget https://downloads.mysql.com/archives/get/p/23/file/mysql-8.0.41-linux-glibc2.28-x86_64.tar.xz
```

3. **Añadir el cliente MySQL al PATH para poder ejecutarlo desde cualquier ubicación:**

```bash
export PATH=$PWD/mysql-8.0.41-linux-glibc2.28-x86_64/bin:$PATH
```

Con esto, el comando mysql estará disponible para conectarse a la base de datos RDS.

## Conexión a la base de datos RDS

Una vez instalado el cliente MySQL en la instancia EC2, se puede conectar a la base de datos RDS con el siguiente comando:

```bash
mysql -h <RDS-ENDPOINT> -P 3306 -u <usuario> -p
```
- "RDS-ENDPOINT": Reemplaza con el endpoint de tu instancia RDS (por ejemplo: mascoteriadb.cztu0ubrlis0.us-east-1.rds.amazonaws.com).
- "usuario": Usuario con permisos en la base de datos (por ejemplo: admin).

Al ejecutar el comando, se solicitará la contraseña del usuario para establecer la conexión.

## Creación de la tabla y datos iniciales

En la base de datos RDS se recrea la misma estructura utilizada en la versión local. Para ello se ejecutan los comandos del archivo [`database.sql`](./database.sql), que incluyen:

- Creación de la tabla `Mascotas`.
- Inserción de los datos iniciales para pruebas.

Esto asegura que la aplicación desplegada en AWS pueda funcionar con la misma información que se utilizó durante el desarrollo local.

<img width="921" height="516" alt="image" src="https://github.com/user-attachments/assets/8128c84b-41b5-4390-8f68-a6fe1e3b9eef" />

## Instalación de Node.js en la instancia EC2

Una vez creada la tabla en la base de datos RDS, el siguiente paso es instalar **Node.js** y **npm** en la instancia EC2.  
Para ello se ejecutan los siguientes comandos:

```bash
sudo yum update -y
sudo yum install -y nodejs npm
```
Con esto, el servidor ya estará preparado para ejecutar la aplicación web.

### Conexión de la aplicación a la base de datos RDS  

Se edita la sección de configuración de la base de datos en el archivo `server.js` para que la aplicación web se conecte directamente a la **instancia RDS MySQL** creada en la **subnet privada**.  

En este punto, se reemplazan los valores de `host`, `user` y `password` por los correspondientes a la RDS.  

```js
const dbConfig = {
    host: '<RDS-ENDPOINT>',
    port: 3306,
    user: 'admin',
    password: '<password-RDS>',
    database: 'MascoteriaDB'
};
```

### Copiar el repositorio a la instancia EC2  

Para desplegar la aplicación en el servidor, se copia el repositorio completo desde la máquina local hacia la instancia **EC2**.  

Este comando debe ejecutarse desde la carpeta donde se encuentra la clave `.pem` y el repositorio:  

```bash
scp -i "<nombre archivo claves.pem>" -r <Carpeta repositorio> ec2-user@<IP-pública-EC2>:/home/ec2-user/
```

Ejemplo:
```bash
scp -i "server-web-mascoteria.pem" -r C:\claves\mascoteria ec2-user@44.223.109.54:/home/ec2-user/
```
De esta forma, la carpeta del proyecto quedará disponible en /home/ec2-user/ dentro del servidor EC2.

### Instalar dependencias y ejecutar la aplicación en EC2  

De manera análoga a como se realiza en el entorno local, dentro del servidor **EC2** ingresamos a la carpeta del repositorio y ejecutamos los siguientes comandos:  

```bash
cd mascoteria
npm install
sudo node server.js
```
Con esto, la aplicación quedará corriendo en el puerto 80 de la instancia EC2 y podrá ser accedida desde el navegador a través de la IP pública del servidor.

La aplicación web de la **Mascotería** queda activa en la instancia **EC2**, conectada correctamente al **RDS MySQL** en la subnet privada.  
Ahora la página permite gestionar mascotas desde la interfaz web, almacenando los datos directamente en la base de datos en la nube.  
<img width="921" height="595" alt="image" src="https://github.com/user-attachments/assets/6c1a71c0-05ed-472b-a16d-98b3cf6144ab" />

### Creación de la AMI del servidor web  

Para implementar escalabilidad en la solución, el primer paso es crear una **AMI (Amazon Machine Image)** a partir de la instancia **EC2** que contiene el servidor web.  
Esta imagen incluye todo el entorno configurado y la aplicación desplegada, permitiendo que nuevas instancias puedan ser replicadas de forma horizontal de manera rápida y consistente.  

<img width="928" height="151" alt="image" src="https://github.com/user-attachments/assets/6aeb0303-bdf2-4bee-bfd0-a5f55d7c1563" />

### Creación de una segunda instancia EC2 a partir de la AMI  

Utilizando la **AMI** previamente creada, se lanza una **segunda instancia EC2**.  
Para automatizar el inicio de la aplicación web, se configura el siguiente **User Data**, que se ejecuta al iniciar la instancia:  

```bash
#!/bin/bash
cd /home/ec2-user/mascoteria
sudo node server.js &
```
Esta configuración asegura que el servidor web se inicie automáticamente al levantar la instancia, replicando el entorno original de manera rápida y consistente.

Servidor creado con la AMI
<img width="921" height="297" alt="image" src="https://github.com/user-attachments/assets/083a6f24-3874-4e75-befa-76613975d594" />

Servidor Original
<img width="921" height="235" alt="image" src="https://github.com/user-attachments/assets/6a12c4b0-9fb6-4f42-887e-ab966c623101" />

### Configuración del Load Balancer  

Para distribuir el tráfico entre las instancias EC2 que ejecutan la aplicación web, se realiza lo siguiente:

1. Se crea un **Target Group** que apunta a las dos instancias EC2.
2. Se lanza un **Elastic Load Balancer (ELB)** y se configura para que dirija el tráfico al Target Group previamente creado.

Con esto, todo el tráfico HTTP hacia la aplicación será balanceado automáticamente entre las instancias disponibles, asegurando disponibilidad y tolerancia a fallos.

Pagina web accedida desde el balanceador (observar URL)
<img width="921" height="298" alt="image" src="https://github.com/user-attachments/assets/bb08da1a-bf6a-412f-a7bc-888ce271371b" />

### Creación de la Launch Template

Para automatizar el despliegue de nuevas instancias EC2 con la aplicación web, se crea una **Launch Template**:

- Se utiliza la **AMI** previamente creada que contiene toda la aplicación lista para ejecutarse.
- Se agregan los **comandos de User Data** para que, al iniciar la instancia, se ejecute automáticamente la aplicación:

```bash
#!/bin/bash
cd /home/ec2-user/mascoteria
sudo node server.js &
```
<img width="921" height="178" alt="image" src="https://github.com/user-attachments/assets/2390afb8-7580-42e4-80d0-131a68cf9af4" />

### Creación del Auto Scaling Group

Para habilitar la **escalabilidad automática** de la aplicación web:

- Se crea un **Auto Scaling Group (ASG)** que despliega instancias EC2 según la demanda.
- Se utiliza la **Launch Template** creada previamente, asegurando que cada instancia tenga la aplicación lista para ejecutarse.
- Se adjunta el ASG al **Elastic Load Balancer** creado, para que el tráfico se distribuya automáticamente entre todas las instancias disponibles.
- Se define que el **número deseado de instancias** es **3**, permitiendo que el ASG mantenga siempre esta cantidad de instancias activas, ajustando automáticamente si alguna falla o si se necesitan más instancias en caso de aumento de tráfico.
<img width="921" height="139" alt="image" src="https://github.com/user-attachments/assets/95aa6eec-5b24-4fde-8a06-e8b4d6f1654f" />

### Estado final de las instancias EC2

- Como se definió un **número deseado de 3 instancias** en el Auto Scaling Group (ASG), se desplegaron automáticamente **3 nuevas instancias**.
- Sumadas a las **2 instancias EC2 existentes** creadas previamente, actualmente tenemos un **total de 5 instancias EC2** corriendo.
- Todas estas instancias se encuentran **detrás del Elastic Load Balancer**, que distribuye el tráfico de manera uniforme entre ellas.
<img width="921" height="211" alt="image" src="https://github.com/user-attachments/assets/1a19e711-d482-4e6d-9ee7-12299186e60a" />

### Verificación de escalabilidad

- Al recargar la página web, se puede observar que **se muestran las nuevas IPs** correspondientes a las instancias EC2 **creadas automáticamente** por el Auto Scaling Group.
- Esto confirma que el **balanceador de carga distribuye correctamente el tráfico** entre todas las instancias activas.

<img width="921" height="290" alt="image" src="https://github.com/user-attachments/assets/280517fd-a902-44b1-a5a0-2aefc858bb79" />
<img width="921" height="296" alt="image" src="https://github.com/user-attachments/assets/665c3786-597d-4e0c-b95a-c5020653ba8c" />



