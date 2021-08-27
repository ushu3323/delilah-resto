# Delilah Restó

API de gestion del restaurante <br>
Link del repositorio en github: https://github.com/ushu3323/delilah-resto

# Dependencias
### express:
 Responsable de responder a las peticiones
### swagger-ui-express:
 Ofrece una interfaz web para mostrar la documentación
### yamljs:
 Transforma un archivo yaml a objeto javascript, util para poder mostrar la documentacion (realizado en el archivo `swagger.yaml`) con swagger-ui-express

# Instalación

## 1- Instalar todas las dependencias
```
 npm i
```

## 2- Iniciar servidor
```
npm start
```

Por defecto, utilizara el puerto `5000`

Para mas informacion acerca de como interactuar con la API, dirijase a la ruta `/docs` del servidor iniciado