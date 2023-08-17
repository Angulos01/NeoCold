Instalacion y ejecución del proyecto de Sistema de Monitoreo de Contenedor fríos

En los siguientes archivo se requiere instalar los módulos faltantes, para instalar los módulos se requieres estos comando en respectivos carpetas

AplicacionMovil/appmovil
	yarn install

AplicacionWeb/frontreactjs
	npm install



Modificar codigo en los siguientes archivos:

AplicacionMovil/backend/app.py
Dentro de la seccion de host reemplazar la ip utilizando la que esta conectada tu computadora.
------------------------------------------------------------------------------------------
if __name__ == '__main__':
    #socketio.run(app, debug=True)
    app.run(host='192.168.0.6',port=5000)
------------------------------------------------------------------------------------------


AplicacionMovil/appmovil/src/common/ip.js
Reemplazar la ip con correspondiente a la internet que esta conectado con la computadora y el teléfono.
------------------------------------------------------------------------------------------
export const ip = '192.168.0.6'
------------------------------------------------------------------------------------------


Se requiere instalar 
Redis-cli



Unix:
	sudo apt update
	sudo apt install redis-cli


Windows:
	Visita la página de descargas de Redis en Windows: https://github.com/microsoftarchive/redis/releases
	Descarga la última versión del archivo ZIP que incluye redis-cli y otros archivos necesarios.
	Descomprime el archivo ZIP en una ubicación de tu elección.
	Abre una terminal de comandos (cmd) y navega a la carpeta donde descomprimiste los archivos.
	Ejecuta redis-cli.exe desde la terminal para usar redis-cli.
	



Como ejecutar el proyecto:
Para ejecutar el proyecto completo se requieres que ejecute en el terminal estos comandos en


-Movil:
    1- AplicacionMovil/backend
	flask run --host=ip_correspondiente

    2- AplicacionMovil/appmovil
	npx expo start


-Web:
    1- AplicacionWeb/backend
	flask run

    2- AplicacionWeb/frontreactjs
	npm run dev