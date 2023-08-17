
from flask import Flask, render_template, request, Response, jsonify, session, redirect
from flask_mqtt import Mqtt
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO
from flask_bootstrap import Bootstrap
from flask_session import Session
from pymongo import MongoClient
import json
from flask_cors import CORS, cross_origin
import secrets
from config import ApplicationConfig 

app = Flask(__name__)
app.secret_key = secrets.token_hex(24)
bcrypt = Bcrypt(app)
app.config.from_object(ApplicationConfig)

CORS(app, supports_credentials=True)  # Habilita CORS para toda la aplicacion
### mqtt Process start ###
app.config['SECRET_KEY'] = '16562d267c0b4610e24769355b46c6b4a22a61f16e9cfe43'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_TYPE'] = 'redis'
Session(app)

local_client = MongoClient('mongodb://localhost:27017/')
local_db = local_client['NeoCold3']

cloud_client = MongoClient('mongodb+srv://angelgalvezsilvas150:ThisFire01@sandbox.np8zgzi.mongodb.net/?retryWrites=true&w=majority')
cloud_db = cloud_client['NeoCold3']

app.config['MQTT_BROKER_URL'] = 'broker.hivemq.com'
app.config['MQTT_BROKER_PORT'] = 1883  # Puerto predeterminado de MQTT
app.config['MQTT_KEEPALIVE'] = 20  # Segundos de tiempo de espera para mantener la conexión MQTT


mqtt = Mqtt(app)
socketio = SocketIO(app)
bootstrap = Bootstrap(app)
mqtt_publisher = '/NeoCold/boxes'


if __name__ == '_main_':
    socketio.run(app, debug=True)
    app.run(host='127.0.0.1',port=5000)


@mqtt.on_connect()
def handle_mqtt_connect(client, userdata, flags, rc):
    mqtt.subscribe(mqtt_publisher)

@app.route("/webhook", methods=["POST"])
def handle_webhook():
    data = request.json  # Assuming the MQTT data is sent as JSON in the POST request
    print(f"Webhook received with data: {data}")

    # You can process the received data here if needed, and then send it to the React app via Socket.IO or any other method.
    # For simplicity, we'll use Socket.IO to emit the "new_data" event to the React app as you did in your previous code.
    socketio.emit('new_data', data, namespace='/')
    
    return jsonify({"status": "success"})

#Proceso que recibe el mensaje mqtt e inserta a la base de datos
@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    data = json.loads(message.payload.decode())
    print(f"Mensaje recibido en tópico {message.topic}: {data}")
    #insert_mysql(data)
    insert_mongo_local(data)
    insert_mongo_nube(data)
    socketio.emit('new_data', data, namespace='/')




@app.route('/')
def index():
    return render_template('/index.html')





### User process start ###
@app.route("/login", methods=["POST"])
def login_user():
    username1 = request.json["username"]
    password1 = request.json["password"]
    session['username'] = username1
    session['password'] = password1
    print(session)
    
   # Obtener el usuario de la base de datos
    user = cloud_db.user.find_one({'username': username1},{'_id': 0})
    if user is None:
        print({{"message": 'Login Failure'}})
        return jsonify({"error": "User not found"}), 404
    else:
        print({"message": "Login successful"})
        return jsonify({"message": "Login successful"}), 200
    

# Ruta para cerrar sesión
@app.route("/logout", methods=["POST"])
def logout_user():
    # Limpiar la sesión
    session.clear()
    return "200"

# Función para obtener los datos del usuario actual
@app.route("/@me",methods=['POST','GET'])
def get_current_user():
    data = request.get_json()
    print(data)
    user = data.get('username')
    password = data.get('password')
    print(user)
    print(password)
    try:
        #------USER
        results = cloud_db.user.aggregate([ { '$match': { 'username': user, 'password': password, } }, { '$lookup': { 'from': "company", 'localField': "company", 'foreignField': "id", 'as': "company", } }, { '$unwind': "$company" }, { '$project': { '_id': 0, 'number': 1, 'username': 1, 'password': 1, 'name': 1, 'last': 1, 'birthdate': 1, 'age': 1, 'occupation': 1, 'company': { 'id': "$company.id", 'nombre': "$company.nombre", 'direccion': "$company.direccion", 'ciudad': "$company.ciudad", 'pais': "$company.pais", 'telefono': "$company.telefono", 'correo_electronico': "$company.correo_electronico", }, } }, { '$group': { '_id': None, 'user': {'$first': "$$ROOT"} } }, { '$project': {'_id': 0, 'user': 1} }, ])
        key_users = [doc['user'] for doc in results]
        #------///USER
        #------BOXES
        resultz = cloud_db.user.aggregate([ { '$match': { 'username': user, 'password': password } }, { '$lookup': { 'from': 'boxes', 'localField': 'number', 'foreignField': 'client', 'as': 'boxes' }}, { '$unwind': '$boxes' }, { '$lookup': { 'from': 'transports', 'localField': 'boxes.transports', 'foreignField': 'claveTransport', 'as': 'boxes.transports' }}, { '$unwind': '$boxes.transports' }, { '$lookup': { 'from': 'conductor', 'localField': 'boxes.transports.conductor', 'foreignField': 'id', 'as': 'boxes.transports.conductor' }}, { '$unwind': '$boxes.transports.conductor' }, { '$project': { '_id': 0, 'boxes.key_box': 1, 'boxes.nombre': 1, 'boxes.client': 1, 'boxes.transports': { 'claveTransport': 1, 'matriculavehi': 1, 'SeguroVehiculo': 1, 'conductor': { 'id': '$boxes.transports.conductor.id', 'name': '$boxes.transports.conductor.name', 'last': '$boxes.transports.conductor.last', 'curp': '$boxes.transports.conductor.curp', 'rfc': '$boxes.transports.conductor.rfc', 'social_service': '$boxes.transports.conductor.social_service', 'phone': '$boxes.transports.conductor.phone', 'company': '$boxes.transports.conductor.company' } } }}, { '$group': { '_id': 'null', 'boxes': { '$push': '$boxes' } }}, { '$project': { '_id': 0, 'boxes': 1 }} ])
        key_box = [doc['boxes'] for doc in resultz]
        print('--------')
        print(key_box)
        #------////BOXES
        #------LOGS
        result = cloud_db.boxes.aggregate([ { '$lookup': { 'from': 'user', 'let': {'clientNumber': '$client'}, 'pipeline': [ { '$match': { '$expr': { '$and': [ {'$eq': ['$username', user]}, {'$eq': ['$password', password]}, {'$eq': ['$number', '$$clientNumber']} ] } } }, {'$project': {'_id': 0, 'number': 1}} ], 'as': 'user' } }, {'$match': {'user': {'$ne': []}}}, {'$project': {'_id': 0, 'key_box': 1}} ])
        key_logs = [doc['key_box'] for doc in result]
        print('--------')
        print(key_logs)
        jsonlogs = {}  # Crear un diccionario vacío para almacenar los datos
        for box in key_logs:
            logs_results = cloud_db.logs.find({'box': box}, {'_id': 0})  # Excluir el campo _id
            logs_results_list = list(logs_results)
            if box in jsonlogs:
                jsonlogs[box].append(logs_results_list)
            else:
                jsonlogs[box] = logs_results_list
        #------////LOGS
        response_data = {
            'user': key_users[0],
            'boxes': key_box[0],
            'logs': jsonlogs
        }
        #session["user_id"] = user
        return jsonify(response_data)
        
    except Exception as e:
        print("Error en MongoDB:", e)  # Imprimir el mensaje de error en la consola
        print('-------------')
        #------USER
        results = cloud_db.user.aggregate([ { '$match': { 'username': user, 'password': password, } }, { '$lookup': { 'from': "company", 'localField': "company", 'foreignField': "id", 'as': "company", } }, { '$unwind': "$company" }, { '$project': { '_id': 0, 'number': 1, 'username': 1, 'password': 1, 'name': 1, 'last': 1, 'birthdate': 1, 'age': 1, 'occupation': 1, 'company': { 'id': "$company.id", 'nombre': "$company.nombre", 'direccion': "$company.direccion", 'ciudad': "$company.ciudad", 'pais': "$company.pais", 'telefono': "$company.telefono", 'correo_electronico': "$company.correo_electronico", }, } }, { '$group': { '_id': None, 'user': {'$first': "$$ROOT"} } }, { '$project': {'_id': 0, 'user': 1} }, ])
        key_users = [doc['user'] for doc in results]
        #------///USER
        #------BOXES
        resultz = cloud_db.user.aggregate([ { '$match': { 'username': user, 'password': password } }, { '$lookup': { 'from': 'boxes', 'localField': 'number', 'foreignField': 'client', 'as': 'boxes' }}, { '$unwind': '$boxes' }, { '$lookup': { 'from': 'transports', 'localField': 'boxes.transports', 'foreignField': 'claveTransport', 'as': 'boxes.transports' }}, { '$unwind': '$boxes.transports' }, { '$lookup': { 'from': 'conductor', 'localField': 'boxes.transports.conductor', 'foreignField': 'id', 'as': 'boxes.transports.conductor' }}, { '$unwind': '$boxes.transports.conductor' }, { '$project': { '_id': 0, 'boxes.key_box': 1, 'boxes.nombre': 1, 'boxes.client': 1, 'boxes.transports': { 'claveTransport': 1, 'matriculavehi': 1, 'SeguroVehiculo': 1, 'conductor': { 'id': '$boxes.transports.conductor.id', 'name': '$boxes.transports.conductor.name', 'last': '$boxes.transports.conductor.last', 'curp': '$boxes.transports.conductor.curp', 'rfc': '$boxes.transports.conductor.rfc', 'social_service': '$boxes.transports.conductor.social_service', 'phone': '$boxes.transports.conductor.phone', 'company': '$boxes.transports.conductor.company' } } }}, { '$group': { '_id': 'null', 'boxes': { '$push': '$boxes' } }}, { '$project': { '_id': 0, 'boxes': 1 }} ])
        key_box = [doc['boxes'] for doc in resultz]
        #------////BOXES
        #------LOGS
        result = cloud_db.boxes.aggregate([ { '$lookup': { 'from': 'user', 'let': {'clientNumber': '$client'}, 'pipeline': [ { '$match': { '$expr': { '$and': [ {'$eq': ['$username', user]}, {'$eq': ['$password', password]}, {'$eq': ['$number', '$$clientNumber']} ] } } }, {'$project': {'_id': 0, 'number': 1}} ], 'as': 'user' } }, {'$match': {'user': {'$ne': []}}}, {'$project': {'_id': 0, 'key_box': 1}} ])
        key_logs = [doc['key_box'] for doc in result]
        print(key_logs)
        jsonlogs = {}  # Crear un diccionario vacío para almacenar los datos
        for box in key_logs:
            logs_results = cloud_db.logs.find({'box': box}, {'_id': 0})  # Excluir el campo _id
            logs_results_list = list(logs_results)
            if box in jsonlogs:
                jsonlogs[box].append(logs_results_list)
            else:
                jsonlogs[box] = logs_results_list
        #------////LOGS
        response_data = {
            'user': key_users[0],
            'boxes': key_box[0],
            'logs': jsonlogs
        }
        #session['user_id'] = user
        return jsonify(response_data)


@app.route("/register", methods=["POST"])
def register_user():
    datos = {
        'username' : request.json["username"],
        'password' : request.json["password"],
        'name' : request.json["name"],
        'last' : request.json["last"],
        'birthdate' : request.json["birthdate"],
        'age' : request.json["age"],
        'occupation' : request.json["occupation"],
        'company ': request.json['company']
    }
    try:
        cloud_db.user.insert_one(datos)
        print("Se registro correctamente")
        return {'message':'Se registro correctamente'}
    except Exception as e:
        print("Error"+e)
        return {"message":e}

### User process end --------------------------------------------------------------------###
### Funcional Web start --------------------------------------------------------------------###
@app.route('/transportList', methods=['GET'])
def transportList():
    result = cloud_db.transports.find()
    listaTransports = []
    for i in result:
        listaTransports.append(i['claveTransport'])
        print("Lista se desplego correctamente")
        print(listaTransports)
    return {'listaTransports': listaTransports}

@app.route('/conductorList', methods=['GET'])
def conductorList():
    result = cloud_db.conductor.find()
    listaConductors = []
    for i in result:
        full_name = i['name'] + ' ' + i['last']
        listaConductors.append(full_name)
        print("Lista se desplego correctamente")
        print(listaConductors)
    return {'listaConductors': listaConductors}


@app.route('/addboxtoclient', methods=['POST'])
def addboxclient():
    data = request.get_json()
    boxname = data.get('boxname')
    cliente = data.get('cliente')
    key_transport = data.get('claveTransport')
    id = data.get('id')
    
    transporte = data.get('transport')
    conductore = data.get('conductor')
    
    transport = {
        'seguroVehiculo': data.get('seguroVehiculo'),
        'claveTransport': data.get('claveTransport'),
        'matricula': data.get('matricula'),
        'conductor': id  # Using the extracted id
    }
    
    conductor = {
        'id': id,  # Using the extracted id
        'name': data.get('name'),
        'last': data.get('last'),
        'curp': data.get('curp'),
        'rfc': data.get('rfc'),
        'social_service': data.get('social_service'),
        'phone': data.get('social_service'),
        'company': data.get('company')
    }
    
    logs = {
        'box': data.get('boxname'),
        'time': '23/01/01,12:00:00',
        'temperatura_actual': '1',
        'humedad_actual': '1',
        'coint': '1',
        'luz_photores': '1',
        'latitud': '1.0',
        'longitud': '1.0',
        'energia': '3700'
    }

    # Check if claveTransport already exists
    if cloud_db.transports.find_one({'claveTransport': key_transport}):
        return {'message': 'claveTransport already exists. Insertion stopped.'}
    
    try:
        if transporte or conductore:
            # Update conductor information in transport
            cloud_db.transports.update_one(
                {'claveTransport': key_transport},
                {'$set': {'conductor': id}}
            )
            return {'message': 'Update Correct'}
        else:
            cloud_db.transports.insert_one(transport)
            cloud_db.conductor.insert_one(conductor)
            
            if cloud_db.logs.find_one({'box': data.get('boxname')}) is None:
                cloud_db.logs.insert_one(logs)
                    
            json = {'nombre': boxname}
            json2 = {'$set': {'client': cliente, 'transports': key_transport}}
            result = cloud_db.boxes.update_one(json, json2)
            print('Documentos coincidentes:', result.matched_count)
            print('Documentos modificados:', result.modified_count)
            print({'message': 'Update Correct'})
            
            return {'message': 'Update Correct'}
        
    except Exception as e:
        print("Error", e)
        return {"message": str(e)}
    
        
@app.route('/deleteboxclient',methods=['POST'])
def delboxclient():
    data = request.get_json()
    boxname = data.get('boxname')
    cliente = data.get('cliente')
    try:
        result = cloud_db.boxes.update_one( {'key_box': boxname, 'client': cliente},{'$set': {'client': None,'transports':None}} )
        print('Documentos coincidentes:', result.matched_count)
        print('Documentos modificados:', result.modified_count)
        return {'message':'Update Correct del'}
    except Exception as e:
        print("Error"+e)
        return {"message":e}
    
@app.route('/updconductor', methods=['POST'])
def updconductor():
    data = request.get_json()      
    nuevoData = {}
    for clave, valor in data.items():
        if clave == 'id':
            continue
        if valor != '' and valor is not None:  # Corregido el operador lógico aquí
            nuevoData[clave] = valor    
    print(nuevoData)
    try:
        cloud_db.conductor.update_one({"id": data['id']}, {'$set': nuevoData})  # Accede a 'id' usando data['id']
        print('Se actualizo correctamente')
        return {"Message": "Se Actualizo correctamente"}
    except Exception as e:
        return {"Message": str(e)}  # Convierte la excepción en una cadena de texto
### Funcional Web end --------------------------------------------------------------------###
### Mongo Process start --------------------------------------------------------------------###
def insert_mongo_local(data):
    try:
        local_db.logs.insert_one(data)  # Inserta el documento en la colección de MongoDB
        print("Insercion exitosa a Mongo local")
    except Exception as e:
        print(f"Error al insertar en MongoDB: {str(e)}")
        
def insert_mongo_nube(data):
    try:
        cloud_db.logs.insert_one(data)  # Inserta el documento en la colección de MongoDB
        print("Insercion exitosa a Mongo nube")
    except Exception as e:
        print(f"Error al insertar en MongoDB: {str(e)}")

# Función para convertir ObjectId a cadena


def jsonify_with_objectid(data):
    for document in data:
        document['_id'] = str(document['_id'])  # Convierte el ObjectId a cadena
    return data

def convert_row_to_object(column_names, row):
    return {column_names[i]: convert_to_serializable(row[i]) for i in range(len(column_names))}



@app.route('/allaboutclient',methods=['GET'])
def cliient():
    if 'user' in session:
        user = session['user']
        print(user)
    else:
        print ('No user')
    if 'pass' in session:
        password = session['pass']
        print(password)
    return { 'user':user,'password':password}



@app.route('/deletelastbox',methods=['GET'])
def deletelastbox():
    try:
        boxes = cloud_db.boxes.find()
        count = 0
        for i in boxes:
            count = count + 1
        cloud_db.boxes.delete_one({'key_box': boxes[count].key_box})
        print("Success")
        boxes = cloud_db.boxes.find()
        for i in boxes:
            print(i)
        return {'message':'true'}
    except:
        return {'message':'false'}
    

@app.route('/ClientAddBox', methods=['POST'])
def ClientAddBox():
    data = request.get_json()
    nombre = data.get('nombre')
    new_client = data.get('client')
    try:
        query = {'nombre': nombre}
        update_data = {'$set': {'client': new_client}}
        result = cloud_db.boxes.update_one(query, update_data)
        if result.modified_count > 0:
            boxes = cloud_db.boxes.find()
            for box in boxes:
                print(box['key_box'], box['client'])
            return {'message': 'Se ha registrado el nuevo cliente de la caja'}
        else:
            return {'message': 'No se encontró la caja para actualizar'}
    except Exception as e:
        print(f"Error al insertar en MongoDB: {str(e)}")
        return {'message': 'Error'}



@app.route('/allboxes',methods=['GET'])
def allbox(): 
    try:
        allboxes = cloud_db.boxes.find({},{'_id':0})
        boxes_list = []
        for i in allboxes:
            boxes_list.append(i)
        print(boxes_list)
        return { 'all_boxes': boxes_list }
    except Exception as e:
        return { 'message': e + 'this'}
    




#--------------Crud de Admin -------------------
#boxes
@app.route('/NewBoxSent', methods=['POST'])
def NewBoxSent():
    data = request.get_json()
    namebox = data.get('nombre')
    count = 1
    #random_number = random.randint(100000, 999999)  # Generar número aleatorio de 6 dígitos
    #random_string = 'NCB{}'.format(random_number)
    box = cloud_db.boxes.find()
    for i in box:
        count = count + 1
    newName = 'NeoCold{}'.format(count)
    query = { 'key_box': newName, 'nombre': namebox, 'client': 'null','transports':'null' }
    try:
        message = cloud_db.boxes.insert_one(query) 
        return {'message': 'True'}
    except Exception as e:
        print(f"Error al insertar en MongoDB: {str(e)}")
        return {'message': 'False'}
    
#Company User
#Read
'''
PENDIENTE!!
@app.route('/ReadCompanyUser',methods=['GET'])
def readUserCompany():
    results = cloud_db.company.find({},{'_id':0})
'''

#Create
@app.route('/CompanyUser')
def companyuser():
    data = request.get_json()    
    nombre = data.get('nombre')
    direccion = data.get('direccion')
    ciudad = data.get('ciudad')
    pais = data.get('pais')
    telefono = data.get('telefono')
    correo = data.get('correo_electronico')
    company_data = {
        'nombre': nombre,
        'direccion': direccion,
        'ciudad': ciudad,
        'pais': pais,
        'telefono': telefono,
        'correo_electronico': correo
    }
    try:
        result = cloud_db.company.insert_one(company_data)
        inserted_id = result.inserted_id
        print({'message': 'Company inserted successfully', 'inserted_id': str(inserted_id)})
        number =  data.get('number')
        username = data.get('username')
        password = data.get('password')
        name = data.get('name')
        last = data.get('last')
        birthdate = data.get('birthdate')
        age = data.get('age')
        occupation = data.get('occupation')
        user_data = {
            'number': number,
            'username': username,
            'password': password,
            'name': name,
            'last': last,
            'birthdate': birthdate,
            'age': age,
            'occupation': occupation,
            'company': nombre,
        }
        result = cloud_db.user.insert_one(user_data)
        inserted_id = result.inserted_id
        print({'message': 'User inserted successfully', 'inserted_id': str(inserted_id)})
        return ({'message': 'Company and User successfully', 'inserted_id': str(inserted_id)})
        
        
    except Exception as e:
        return jsonify({'message': 'Error inserting company', 'error': str(e)})

#Transporte y company
@app.route('/optioncompany', methods=['GET'])
def predrivercompany():
    result = cloud_db.company.find()
    lista = []
    for i in result:
        lista.append(i['nombre'])
    print("Lista se desplego correctamente")
    return {'listcompany': lista}

@app.route('/TransportDrivers', methods=['POST'])
def drivercompany():
    data = request.get_json()
    driver_data = {
        'id': data.get('id'),
        'name': data.get('name'),
        'last': data.get('last'),
        'curp': data.get('curp'),
        'rfc': data.get('rfc'),
        'social_service': data.get('social_service'),
        'phone': data.get('phone'),
        'company': data.get('company')
    }
    try:
        # Inserta el documento en el Collection "drivers"
        result = cloud_db.conductor.insert_one(driver_data)
        inserted_id = result.inserted_id
        print({'message': 'Driver inserted successfully', 'inserted_id': str(inserted_id)})
        transport_data = {
            'claveTransport': data.get('claveTransport'),
            'matriculavehi': data.get('matriculavehi'),
            'SeguroVehiculo': data.get('SeguroVehiculo'),
            'conductor': data.get('company')
        }
        try:
            result = cloud_db.transports.insert_one(driver_data)
            inserted_id = result.inserted_id
            print({'message': 'Transport and driver inserted successfully', 'inserted_id': str(inserted_id)})
            return jsonify({'message': 'Transport and driver inserted successfully', 'inserted_id': str(inserted_id)})
        except Exception as e:
             return jsonify({'message': 'Error inserting transport', 'error': str(e)})
    except Exception as e:
        return jsonify({'message': 'Error inserting driver', 'error': str(e)})


    
    

    

@app.route('/database', methods=['POST'])
def database():
    data = request.get_json()
    user = data.get('email')
    password = data.get('password')
    print(user)
    print(password)
    session['user'] = user
    session['pass'] = password
    try:
        #------USER
        results = cloud_db.user.aggregate([ { '$match': { 'username': user, 'password': password, } }, { '$lookup': { 'from': "company", 'localField': "company", 'foreignField': "id", 'as': "company", } }, { '$unwind': "$company" }, { '$project': { '_id': 0, 'number': 1, 'username': 1, 'password': 1, 'name': 1, 'last': 1, 'birthdate': 1, 'age': 1, 'occupation': 1, 'company': { 'id': "$company.id", 'nombre': "$company.nombre", 'direccion': "$company.direccion", 'ciudad': "$company.ciudad", 'pais': "$company.pais", 'telefono': "$company.telefono", 'correo_electronico': "$company.correo_electronico", }, } }, { '$group': { '_id': None, 'user': {'$first': "$$ROOT"} } }, { '$project': {'_id': 0, 'user': 1} }, ])
        key_users = [doc['user'] for doc in results]
        #------///USER
        #------BOXES
        resultz = cloud_db.user.aggregate([ { '$match': { 'username': user, 'password': password } }, { '$lookup': { 'from': 'boxes', 'localField': 'number', 'foreignField': 'client', 'as': 'boxes' }}, { '$unwind': '$boxes' }, { '$lookup': { 'from': 'transports', 'localField': 'boxes.transports', 'foreignField': 'claveTransport', 'as': 'boxes.transports' }}, { '$unwind': '$boxes.transports' }, { '$lookup': { 'from': 'conductor', 'localField': 'boxes.transports.conductor', 'foreignField': 'id', 'as': 'boxes.transports.conductor' }}, { '$unwind': '$boxes.transports.conductor' }, { '$project': { '_id': 0, 'boxes.key_box': 1, 'boxes.nombre': 1, 'boxes.client': 1, 'boxes.transports': { 'claveTransport': 1, 'matriculavehi': 1, 'SeguroVehiculo': 1, 'conductor': { 'id': '$boxes.transports.conductor.id', 'name': '$boxes.transports.conductor.name', 'last': '$boxes.transports.conductor.last', 'curp': '$boxes.transports.conductor.curp', 'rfc': '$boxes.transports.conductor.rfc', 'social_service': '$boxes.transports.conductor.social_service', 'phone': '$boxes.transports.conductor.phone', 'company': '$boxes.transports.conductor.company' } } }}, { '$group': { '_id': 'null', 'boxes': { '$push': '$boxes' } }}, { '$project': { '_id': 0, 'boxes': 1 }} ])
        key_box = [doc['boxes'] for doc in resultz]
        #------////BOXES
        #------LOGS
        result = cloud_db.boxes.aggregate([ { '$lookup': { 'from': 'user', 'let': {'clientNumber': '$client'}, 'pipeline': [ { '$match': { '$expr': { '$and': [ {'$eq': ['$username', user]}, {'$eq': ['$password', password]}, {'$eq': ['$number', '$$clientNumber']} ] } } }, {'$project': {'_id': 0, 'number': 1}} ], 'as': 'user' } }, {'$match': {'user': {'$ne': []}}}, {'$project': {'_id': 0, 'key_box': 1}} ])
        key_logs = [doc['key_box'] for doc in result]
        jsonlogs = {}  # Crear un diccionario vacío para almacenar los datos
        for box in key_logs:
            logs_results = cloud_db.logs.find({'box': box}, {'_id': 0})  # Excluir el campo _id
            logs_results_list = list(logs_results)
            if box in jsonlogs:
                jsonlogs[box].append(logs_results_list)
            else:
                jsonlogs[box] = logs_results_list
        #------////LOGS
        response_data = {
            'user': key_users[0],
            'boxes': key_box[0],
            'logs': jsonlogs
        }
        #session["user_id"] = user
        return jsonify(response_data)
        
    except Exception as e:
        print("Error en MongoDB:", e)  # Imprimir el mensaje de error en la consola
        print('-------------')
        #------USER
        results = cloud_db.user.aggregate([ { '$match': { 'username': user, 'password': password, } }, { '$lookup': { 'from': "company", 'localField': "company", 'foreignField': "id", 'as': "company", } }, { '$unwind': "$company" }, { '$project': { '_id': 0, 'number': 1, 'username': 1, 'password': 1, 'name': 1, 'last': 1, 'birthdate': 1, 'age': 1, 'occupation': 1, 'company': { 'id': "$company.id", 'nombre': "$company.nombre", 'direccion': "$company.direccion", 'ciudad': "$company.ciudad", 'pais': "$company.pais", 'telefono': "$company.telefono", 'correo_electronico': "$company.correo_electronico", }, } }, { '$group': { '_id': None, 'user': {'$first': "$$ROOT"} } }, { '$project': {'_id': 0, 'user': 1} }, ])
        key_users = [doc['user'] for doc in results]
        #------///USER
        #------BOXES
        resultz = cloud_db.user.aggregate([ { '$match': { 'username': user, 'password': password } }, { '$lookup': { 'from': 'boxes', 'localField': 'number', 'foreignField': 'client', 'as': 'boxes' }}, { '$unwind': '$boxes' }, { '$lookup': { 'from': 'transports', 'localField': 'boxes.transports', 'foreignField': 'claveTransport', 'as': 'boxes.transports' }}, { '$unwind': '$boxes.transports' }, { '$lookup': { 'from': 'conductor', 'localField': 'boxes.transports.conductor', 'foreignField': 'id', 'as': 'boxes.transports.conductor' }}, { '$unwind': '$boxes.transports.conductor' }, { '$project': { '_id': 0, 'boxes.key_box': 1, 'boxes.nombre': 1, 'boxes.client': 1, 'boxes.transports': { 'claveTransport': 1, 'matriculavehi': 1, 'SeguroVehiculo': 1, 'conductor': { 'id': '$boxes.transports.conductor.id', 'name': '$boxes.transports.conductor.name', 'last': '$boxes.transports.conductor.last', 'curp': '$boxes.transports.conductor.curp', 'rfc': '$boxes.transports.conductor.rfc', 'social_service': '$boxes.transports.conductor.social_service', 'phone': '$boxes.transports.conductor.phone', 'company': '$boxes.transports.conductor.company' } } }}, { '$group': { '_id': 'null', 'boxes': { '$push': '$boxes' } }}, { '$project': { '_id': 0, 'boxes': 1 }} ])
        key_box = [doc['boxes'] for doc in resultz]
        #------////BOXES
        #------LOGS
        result = cloud_db.boxes.aggregate([ { '$lookup': { 'from': 'user', 'let': {'clientNumber': '$client'}, 'pipeline': [ { '$match': { '$expr': { '$and': [ {'$eq': ['$username', user]}, {'$eq': ['$password', password]}, {'$eq': ['$number', '$$clientNumber']} ] } } }, {'$project': {'_id': 0, 'number': 1}} ], 'as': 'user' } }, {'$match': {'user': {'$ne': []}}}, {'$project': {'_id': 0, 'key_box': 1}} ])
        key_logs = [doc['key_box'] for doc in result]
        print(key_logs)
        jsonlogs = {}  # Crear un diccionario vacío para almacenar los datos
        for box in key_logs:
            logs_results = cloud_db.logs.find({'box': box}, {'_id': 0})  # Excluir el campo _id
            logs_results_list = list(logs_results)
            if box in jsonlogs:
                jsonlogs[box].append(logs_results_list)
            else:
                jsonlogs[box] = logs_results_list
        #------////LOGS
        response_data = {
            'user': key_users[0],
            'boxes': key_box[0],
            'logs': jsonlogs
        }
        #session['user_id'] = user
        return jsonify(response_data)
    
@app.route('/allaboutclient',methods=['GET'])
def cliente():
    if 'user' in session:
        user = session['user']
        print(user)
    else:
        print ('No user')
        user = None
    if 'pass' in session:
        password = session['pass']
        print(password)
    else:
        password = None
    return { 'user':user,'password':password}




