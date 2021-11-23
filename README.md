# Delilah Restó

API de gestión de pedidos del restaurante Delilah Restó<br>
Se ha utilizado el framework node.js junto con express para responder a las peticiones que se realicen
Link del repositorio en github: https://github.com/ushu3323/delilah-resto

## Dependencias
### express:
 Responsable de responder a las peticiones http
### swagger-ui-express:
 Ofrece una interfaz web para mostrar la documentación
### yamljs:
 Convierte un archivo .yaml a objeto javascript, útil para poder mostrar la documentación (realizado en el archivo `swagger.yaml`) con la dependencia swagger-ui-express
### JWT
 Permite encriptar información delicada como contraseñas que luego será enviada/recibida de manera segura entre servidor y cliente
### sequelize
 Utilizado para crear, leer, actualizar y eliminar datos en la base de datos sql a través del modelo de programación ORM


# Requisitos

Además de tener instalado node.js y el administrador de paquetes npm, para poder utilizar el servidor en su equipo, se requiere [MariaDB](https://mariadb.org/download/) (O a traves de [Xampp](https://www.apachefriends.org/download.html)) previamente instalado.

# Instalación

### 1 - Clonar el repositorio
```bash
$ git clone https://github.com/ushu3323/delilah-resto.git
$ cd delilah-resto
```
### 2- Instalar todas las dependencias
```bash
$ npm i
```
### 3- Iniciar servidor MariaDB
Los pasos a seguir de este punto pueden variar dependiendo de como haya optado por obtener MariaDB y de que sistema operativo este utilizando...<br><br>
Por ejemplo, para XAMPP en windows basta con ir al panel principal e iniciar el servidor con el boton `Start` que se encuentra a la derecha del modulo MySQL, luego para acceder al CLI, tienes que presionar el boton `Shell` para abrir una consola que esta ubicado en la carpeta de XAMPP, ejecutas `cd mysql/bin` y ya puedes seguir con el punto 3 que esta a continuación.

### 3- Crear una base de datos
Iniciar CLI de mysql/mariadb y crear una nueva base de datos:
```bash
$ mysql -uroot --password
# ...

MariaDB [(none)]> CREATE DATABASE delilah_resto; # Puede cambiar el nombre a uno que desee
```
### 4- Definir las variables de entorno
Copie el contenido de `.env.example`, peguelo en un archivo nuevo llamado `.env` y modifique los campos que sean necesarios:
```bash
# Puerto de node en donde escuchará el servidor
NODE_PORT = 5000

# Credenciales para el usuario root/admin del servicio
ADMIN_EMAIL = 'admin@example.com'
ADMIN_PASSWORD = 'admin'

# Credenciales de la base de datos
DB_HOST = 'localhost'
DB_USER = 'root'
DB_PASSWORD = '' # Deje en blanco si no posee
DB_PORT = '3306' # Puerto en donde el servidor sql escucha
DB_NAME = 'delilah_resto_test' # Nombre de la base de datos creada previamente


# Clave privada de JWT
KEY = 'jwtkey'
```
### 5- Sincronizar modelos
Ejecute el comando `npm run sync -- -s -r` para crear las tablas necesarias para la api y generar el usuario administrador

# Comandos

```bash
npm test # Ejecuta las rutinas de tests con Mocha
npm start # Inicia la API en modo producción
npm run dev # Inicia la API en modo desarrollador
npm run sync # Utilidad que permite inicializar la base de datos
```

#
Para obtener mas información acerca de los endpoints, visite `/docs`.<br>

**NOTA**: Antes de ejecutar la rutina de tests (`npm test`) se recomienda utilizar una base de datos completamente distinta a la de producción