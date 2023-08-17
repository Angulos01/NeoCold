from flask import Flask, render_template, request, Response, jsonify, session
from flask_mqtt import Mqtt
from flask_session import Session
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO
#from flask_bootstrap import Bootstrap
#import mysql.connector as sqltor
from pymongo import MongoClient
import json
from flask_cors import CORS, cross_origin
import secrets
from config import ApplicationConfig 
import random


app = Flask(__name__)
app.secret_key = secrets.token_hex(24)
bcrypt = Bcrypt(app)
app.config.from_object(ApplicationConfig)

# Configuración de la extensión flask_session
Session(app)

CORS(app, supports_credentials=True)  # Habilita CORS para toda la aplicacion
### mqtt Process start ###
app.config['SECRET_KEY'] = '16562d267c0b4610e24769355b46c6b4a22a61f16e9cfe43'
app.config['MQTT_BROKER_URL'] = 'broker.hivemq.com'
app.config['MQTT_BROKER_PORT'] = 1883  # Puerto predeterminado de MQTT
app.config['MQTT_KEEPALIVE'] = 20  # Segundos de tiempo de espera para mantener la conexión MQTT
mqtt = Mqtt(app)
socketio = SocketIO(app)
#bootstrap = Bootstrap(app)
mqtt_publisher = '/NeoCold/boxes'
mqtt_subscriber = '/UTT/0321101323/User'


cloud_client = MongoClient('mongodb+srv://angelgalvezsilvas150:ThisFire01@sandbox.np8zgzi.mongodb.net/?retryWrites=true&w=majority')
cloud_db = cloud_client['NeoCold3']


if __name__ == '__main__':
    #socketio.run(app, debug=True)
    app.run(host='192.168.0.6',port=5000)


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
    #insert_mongo_local(data)
    insert_mongo_nube(data)

    socketio.emit('new_data', data, namespace='/')



""" Rutas nodejs """
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def mailer(receiver_email, code):
    sender_email = "neo.cold.business@gmail.com"
    sender_password = "tvcnqdmioiodfqqm"

    subject = "Signup Verification"
    message = f"Your Verification Code is {code}"

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject
    msg.attach(MIMEText(message, 'plain'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(sender_email, sender_password)
    server.sendmail(sender_email, receiver_email, msg.as_string())
    server.quit()

@app.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    age = data.get('age')
    birthdate = data.get('birthdate')
    last = data.get('last')
    name = data.get('name')
    occupation = data.get('occupation')
    password = data.get('password')
    username = data.get('username')

    if not (username and password and name and last and birthdate and age and occupation):
        return jsonify(error="Please add all the fields"), 422

    saved_user = cloud_db.user.find_one({"username": username})
    
    if saved_user:
        return jsonify({"error": "User already exists"}), 409

    try:
        verification_code = random.randint(100000, 999999)
        user = {
            "age": age,
            "birthdate": birthdate,
            "last": last,
            "name": name,
            "occupation": occupation,
            "password": password,
            "username": username,
            "VerificationCode": verification_code
        }
        mailer(username, verification_code)
        return jsonify(message="Verification Code Sent to your Email", udata=user)
    except Exception as err:
        print("this happened +", err)
        return jsonify(error="Error occurred while sending verification code"), 500



@app.route('/')
def index():
    return render_template('/index.html')


#Ya la cambie
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
        # 'company ': request.json['company']
    }
    try:
        cloud_db.user.insert_one(datos)
        print("Se registro correctamente")
        return {'message':'Se registro correctamente'}
    except Exception as e:
        print("Error"+e)
        return {"message":e}

### User process end ###


### MySQL Process start ###
db_config = {
    'host': '127.0.0.1',
    'user': 'user12345',
    'password': 'user12345',
    'database': 'neo_colder3',
}
'''
def insert_mysql(data):
    try:
        conn = sqltor.connect(**db_config)
        cursor = conn.cursor()

        query = "INSERT INTO logs (box, time, temperatura_actual, humedad_actual, coint, luz_photores, latitud, longitud, energia) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        values = (data["Neobox"], data["fechahora"], data["temperatura"], data["humedad"], data["co2"], data["luz"], data["latitud"], data["longitud"], data["energy"])
        print(query % values)

        cursor.execute(query, values)
        conn.commit()

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Error al insertar en la base de datos: {str(e)}")
'''

#Proceso para imprimir datos en json
def convert_to_serializable(value):
    if isinstance(value, set):
        return list(value)
    elif isinstance(value, dict):
        return {k: convert_to_serializable(v) for k, v in value.items()}
    elif isinstance(value, (list, tuple)):
        return [convert_to_serializable(item) for item in value]
    else:
        return value

# Ruta para obtener todos los datos de la tabla en forma de API
'''
@app.route('/mysql', methods=['GET'])
def mysql():
    try:
        conn = sqltor.connect(**db_config)
        cursor = conn.cursor()
        table_name = 'logs'

        # Consulta para obtener todos los datos de la tabla
        query = f"SELECT * FROM {table_name} ORDER BY id DESC"
        cursor.execute(query)

        # Obtener los resultados de la consulta
        table_data = []
        column_names = [i[0] for i in cursor.description]

        for row in cursor.fetchall():
            data_dict = {column_names[i]: convert_to_serializable(row[i]) for i in range(len(column_names))}
            table_data.append(data_dict)

        # Cerrar la conexión y el cursor
        cursor.close()
        conn.close()
        return jsonify(table_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

### MySQL Process end ###
'''



def insert_mongo_local(data):
    try:
        local_coleccion.insert_one(data)  # Inserta el documento en la colección de MongoDB
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

'''
@app.route('/mongo_local', methods=['GET'])
def mongo_local():
    datos_local = local_coleccion.find().sort('_id', -1)
    lista_datos = list(datos_local)
    return jsonify_with_objectid(lista_datos)
'''
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


# @app.route('/deleteboxclient',methods=['POST'])
# def delboxclient():
#     data = request.get_json()
#     boxname = data.get('boxname')
#     cliente = data.get('cliente')
#     try:
#         result = cloud_db.boxes.update_one( {'key_box': boxname, 'client': cliente},{'$set': {'client': None,'transports':None}} )
#         print('Documentos coincidentes:', result.matched_count)
#         print('Documentos modificados:', result.modified_count)
#         return {'message':'Update Correct del'}
#     except Exception as e:
#         print("Error"+e)
#         return {"message":e}
    

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



# select 
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



# select users
@app.route('/allusers',methods=['GET'])
def alluser(): 
    try:
        allusers = cloud_db.user.find({},{'_id':0})
        users_list = []
        for i in allusers:
            users_list.append(i)
        print(users_list)
        return { 'all_users': users_list }
    except Exception as e:
        return { 'message': e + 'this'}


# select companies
@app.route('/allcompanies',methods=['GET'])
def allcompany(): 
    try:
        allcompanies = cloud_db.company.find({},{'_id':0})
        companies_list = []
        for i in allcompanies:
            companies_list.append(i)
        print(companies_list)
        return { 'all_companies': companies_list }
    except Exception as e:
        return { 'message': e + 'this'}


# select transports
@app.route('/alltransports',methods=['GET'])
def altransport(): 
    try:
        alltransport = cloud_db.transports.find({},{'_id':0})
        transports_list = []
        for i in alltransport:
            transports_list.append(i)
        print(transports_list)
        return { 'all_transports': transports_list }
    except Exception as e:
        return { 'message': e + 'this'}



# select drivers
@app.route('/alldrivers',methods=['GET'])
def alldrivers(): 
    try:
        alldrivers = cloud_db.conductor.find({},{'_id':0})
        drivers_list = []
        for i in alldrivers:
            drivers_list.append(i)
        print(drivers_list)
        return { 'all_drivers': drivers_list }
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
    


@app.route("/updateCompany", methods=["PUT"])
def update_company():
    update_data = {
        '$set': {
            'direccion': request.json["direccion"],
            'ciudad': request.json["ciudad"],
            'pais': request.json["pais"],
            'telefono': request.json["telefono"],
            'correo_electronico': request.json["correo_electronico"]
        }
    }
    
    id = request.json["id"]
    
    try:
        result = cloud_db.company.update_one({'id': id}, update_data)
        if result.modified_count > 0:
            print("Company information updated successfully")
            return {'message': 'Company information updated successfully'}
        else:
            print("No company found with the provided id")
            return {'message': 'No company found with the provided id'}
    except Exception as e:
        print("Error: " + str(e))
        return {"message": str(e)}
    


@app.route("/updateUser", methods=["PUT"])
def update_user():
    update_data = {
        '$set': {
            'password': request.json["password"],
            'name': request.json["name"],
            'last': request.json["last"],
            'birthdate': request.json["birthdate"],
            'age': request.json["age"],
            'occupation': request.json["occupation"],
            'company': request.json["company"]
        }
    }
    
    username = request.json["username"]
    
    try:
        result = cloud_db.user.update_one({'username': username}, update_data)
        if result.modified_count > 0:
            print("User information updated successfully")
            return {'message': 'User information updated successfully'}
        else:
            print("No user found with the provided username")
            return {'message': 'No user found with the provided username'}
    except Exception as e:
        print("Error: " + str(e))
        return {"message": str(e)}
    


@app.route("/updateDriver", methods=["PUT"])
def update_driver():
    data = request.get_json()
    update_data = {
        '$set': {
            'id': data.get('id'),
            'name': data.get('name'),
            'last': data.get('last'),
            'curp': data.get('curp'),
            'rfc': data.get('rfc'),
            'social_service': data.get('social_service'),
            'phone': data.get('phone'),
            'company': data.get('company')
        }
    }
    
    id = request.json["id"]
    
    try:
        result = cloud_db.conductor.update_one({'id': id}, update_data)
        if result.modified_count > 0:
            print("Driver information updated successfully")
            return {'message': 'Driver information updated successfully'}
        else:
            print("No driver found with the provided id")
            return {'message': 'No driver found with the provided id'}
    except Exception as e:
        print("Error: " + str(e))
        return {"message": str(e)}    



@app.route("/updateTransport", methods=["PUT"])
def update_transport():
    data = request.get_json()
    update_data = {
        '$set': {
            'matriculavehi': data.get('matriculavehi'),
            'SeguroVehiculo': data.get('SeguroVehiculo'),
            'conductor': data.get('conductor')
        }
    }
    
    claveTransport = request.json["claveTransport"]
    
    try:
        result = cloud_db.transports.update_one({'claveTransport': claveTransport}, update_data)
        if result.modified_count > 0:
            print("Transport information updated successfully")
            return {'message': 'Transport information updated successfully'}
        else:
            print("No vehicle found with the provided claveTransport")
            return {'message': 'No vehicle found with the provided claveTransport'}
    except Exception as e:
        print("Error: " + str(e))
        return {"message": str(e)}



@app.route("/updateBox", methods=["PUT"])
def update_box():
    data = request.get_json()
    update_data = {
        '$set': {
            'nombre': data.get('nombre'),
            'client': data.get('client'),
            'transports': data.get('transports')
        }
    }
    
    key_box = request.json["key_box"]
    
    try:
        result = cloud_db.boxes.update_one({'key_box': key_box}, update_data)
        if result.modified_count > 0:
            print("Box information updated successfully")
            return {'message': 'Box information updated successfully'}
        else:
            print("No box found with the provided key_box")
            return {'message': 'No box found with the provided key_box'}
    except Exception as e:
        print("Error: " + str(e))
        return {"message": str(e)}



#Company User
#Read
'''
PENDIENTE!!
@app.route('/ReadCompanyUser',methods=['GET'])
def readUserCompany():
    results = cloud_db.company.find({},{'_id':0})
'''

#Create
@app.route('/CompanyUser',methods=['POST'])
def companyuser():
    data = request.get_json()  
    ciudad = data.get('ciudad')  
    correo = data.get('correo_electronico')
    direccion = data.get('direccion')
    nombre = data.get('nombre')
    pais = data.get('pais')
    telefono = data.get('telefono')
    # data = request.get_json()    
    # nombre = data.get('nombre')
    # direccion = data.get('direccion')
    # ciudad = data.get('ciudad')
    # pais = data.get('pais')
    # telefono = data.get('telefono')
    # correo = data.get('correo_electronico')
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
        'number': data.get('number'),
        'name': data.get('name'),
        'last': data.get('last'),
        'curp': data.get('curp'),
        'rfc': data.get('rfc'),
        'social_service': data.get('social_service'),
        'occupation': data.get('occupation'),
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
            result = cloud_db.transports.insert_one(transport_data)
            inserted_id = result.inserted_id
            print({'message': 'Transport and driver inserted successfully', 'inserted_id': str(inserted_id)})
            return jsonify({'message': 'Transport and driver inserted successfully', 'inserted_id': str(inserted_id)})
        except Exception as e:
             return jsonify({'message': 'Error inserting transport', 'error': str(e)})
    except Exception as e:
        return jsonify({'message': 'Error inserting driver', 'error': str(e)})
    
    
    
@app.route('/deletethebox',methods=['POST'])
def delboxclient2():
    data = request.get_json()
    boxname = data.get('boxname')
    cliente = data.get('cliente')
    try:
        cloud_db.boxes.remove({"client":cliente,"key_box":boxname})
        message = {'message':'Oh! u break my product??? U will pay!!'}
        return message;
    except Exception as e:
        print("Error"+e)
        return {"message":e}
    


    
    

    

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
    
    
    

# CLIENT boxes ------------------------
# CLIENT boxes
# CLIENT boxes
# CLIENT boxes
# CLIENT boxes
# CLIENT boxes
# CLIENT boxes
# CLIENT boxes
# CLIENT boxes
# CLIENT boxes
# CLIENT boxes ------------------------``

@app.route('/deleteboxclient',methods=['PUT'])
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

@app.route('/addboxtoclient',methods=['POST'])
def addboxclient():
    data = request.get_json()
    boxname = data.get('boxname')
    cliente = data.get('cliente')
    key_transport = data.get('claveTransport')
    conductor =  data.get('id')
    transportsss =  []
    conductorsss = []
    for i in cloud_db.transports.find({'claveTransport' : key_transport }):
        i.append(transportsss)
    for j in cloud_db.conductor.find({'id':conductor}):
        j.append(conductorsss)
        
    if transportsss is None:
        print("Si es falso")
        transport = {
            'seguroVehiculo': data.get('seguroVehiculo'),
            'claveTransport': data.get('claveTransport'),
            'matriculavehi': data.get('matriculavehi'),
            'conductor': data.get('id')
        }
        cloud_db.transports.insert_one(transport)
    if conductorsss is None:
        print("Si es falso2")
        '''
        conductor = {
            'id': conductor,
            'name': data.get('name'),
            'last': data.get('last'),
            'curp': data.get('curp'),
            'rfc': data.get('rfc'),
            'social_service': data.get('social_service'),
            'phone': data.get('social_service'),
            'company': data.get('company')
        }
        cloud_db.conductor.insert_one(conductor)
        '''
    
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
     
    return {"Message":"Erick"}
    '''
    try:
        
        
    except Exception as e:
        print("Error"+e)
    
    try:
        if(cloud_db.logs.find({'box': data.get('boxname')})!=True):
            cloud_db.logs.insert_one(logs)
            
        json = {'nombre': boxname}
        json2= {'$set': {'client': cliente, 'transports':key_transport}}
        print(json)
        print(json2)
        result = cloud_db.boxes.update_one(json,json2)
        
        print('Documentos coincidentes:', result.matched_count)
        print('Documentos modificados:', result.modified_count)
        print( {'message':'Update Correct'})
        return {'message':'Update Correct'}
    except Exception as e:
        print("Error"+e)
        return {"message":e}
    '''


# Configuración de la base de datos
client = MongoClient('mongodb://localhost:27017/')
cloud_db = client['NeoCold3']  # Cambia esto según tu base de datos

@app.route('/deletedataoftable', methods=['POST'])
def delete_data():
    data = request.get_json()
    tablename = data.get('table')
    idd = data.get('id')
    key = data.get('key')
    
    print('Received request to delete:', tablename, idd, key)
    query = {key: idd}
    
    try:
        collection = getattr(cloud_db, tablename)
        print(collection)
        result = collection.delete_one(query)
       
        if result.deleted_count > 0:
            message = "Data deleted successfully"
            print({"Message": message})
            return jsonify({"Message": message})
        else:
            message = "No data found for deletion"
            print({"Message": message})
            return jsonify({"Message": message})
    except Exception as e:
        return jsonify({"Error": str(e)})