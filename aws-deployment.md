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
