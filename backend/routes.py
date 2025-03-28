from flask import current_app as app, request, jsonify, render_template, send_file, send_from_directory
from flask_security import auth_required, verify_password, hash_password, roles_required, login_user, roles_accepted, current_user
from backend.models import *
from backend.celery.tasks import add, create_csv, monthly_report
from celery.result import AsyncResult
from datetime import datetime

cache=app.cache


datastore=app.security.datastore

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/celery')
def celery():
    task = add.delay(10, 30)
    return {'task_id' : task.id}

@app.route('/get_celery/<id>')
def celery_get(id):
    res = AsyncResult(id)
    if res.ready():
        return {'ans':res.result}


@app.route('/cache')
@cache.cached(timeout=5)
def cache():
    return {'time': str(datetime.now())}

@app.route('/protected')
@auth_required()
def protected():
    return '<h1> protected </h1>'

@app.route('/api/home')
@auth_required('token')
@roles_accepted('professional', 'customer', 'admin')
def user_home():
    user = current_user
    print('hello')
    return jsonify({
        "username": user.Username,
    })

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(data)
    Username = data.get('Username')
    password = data.get('password')

    if not Username or not password:
        return jsonify({"message" : "invalid inputs"}), 404
    
    user = datastore.find_user(Username = Username)

    if not user:
        return jsonify({"message" : "invalid Username"}), 404
    
    if verify_password(password, user.password):
        login_user(user)
        return jsonify({'token' : user.get_auth_token(), 'Username' : user.Username, 'role' : user.roles[0].name, 'id' : user.ID})
    
    return jsonify({'message' : 'password wrong'}), 400

@app.route('/registercustomer',methods=['POST'])
def register_customer():
    data = request.get_json()

    Username = data.get('Username')
    password = data.get('password')
    location = data.get('location')

    if not Username or not password :
        return jsonify({"message" : "invalid inputs"}), 404
    
    user = datastore.find_user(Username = Username)

    if user:
        return jsonify({"message" : "customer already exists"}), 404

    try :
        datastore.create_user(Username = Username, password = hash_password(password), roles = ['customer'], active = True)
        db.session.commit()
        this_user=User.query.filter_by(Username=Username).first()
        id=this_user.ID
        new_customer=Customer(Name=Username, User_id=id, Location=location)
        db.session.add(new_customer)
        db.session.commit()
        return jsonify({"message" : "customer created"}), 200
    except:
        db.session.rollback()
        return jsonify({"message" : "error creating customer"}), 400
    

@app.route('/registerprofessional',methods=['POST'])
def register_professional():
    data = request.get_json()

    Username = data.get('Username')
    password = data.get('password')
    location = data.get('location')
    serviceid = data.get('serviceid')

    if not Username or not password :
        return jsonify({"message" : "invalid inputs"}), 404
    
    user = datastore.find_user(Username = Username)

    if user:
        return jsonify({"message" : "professional already exists"}), 404

    #try :
    datastore.create_user(Username = Username, password = hash_password(password), roles = ['professional'], active = True)
    db.session.commit()
    this_user=User.query.filter_by(Username=Username).first()
    id=this_user.ID
    this_service=Service.query.filter_by(ID=serviceid).first()
    new_professional=Service_Professional(Name=Username, User_id=id, Location=location, Service=this_service.Name, Service_id=this_service.ID, Status='blocked' )
    db.session.add(new_professional)
    db.session.commit()
    return jsonify({"message" : "professional created"}), 200
    '''except:
        db.session.rollback()
        return jsonify({"message" : "error creating professional"}), 400'''
    



@app.route('/professional/block/<int:pid>')
@auth_required('token') 
@roles_required('admin')
def professional_block(pid):
    this_prof=Service_Professional.query.filter_by(ID=pid).first()
    this_prof.Status='blocked'
    db.session.add(this_prof)
    db.session.commit()
    return jsonify({"message" : "professional blocked"}), 200

@app.route('/professional/approve/<int:pid>')
@auth_required('token') 
@roles_required('admin')
def professional_approve(pid):
    this_prof=Service_Professional.query.filter_by(ID=pid).first()
    this_prof.Status='approved'
    db.session.add(this_prof)
    db.session.commit()
    return jsonify({"message" : "professional approved"}), 200

@app.route('/api/get_service/<int:sid>')
@auth_required('token') 
@roles_required('admin')
def service_get(sid):
    this_service=Service.query.filter_by(ID=sid).first()
    service_json= { 
        "ID":this_service.ID,
        "Name":this_service.Name,
        "BasePrice":this_service.BasePrice,
        "TimeReq":this_service.TimeReq,
        "Desc":this_service.Description
        }
       
    return jsonify(service_json)

@app.route('/api/getservices')
def services():
    services_json=[]
    services=Service.query.all()
    for service in services:
            this_service={}
            this_service['ID']=service.ID
            this_service['Name']=service.Name
            this_service['BasePrice']=service.BasePrice
            services_json.append(this_service)
    return jsonify(services_json)


@app.route('/api/get_professionals/<int:sid>')
@auth_required('token')
def professionals(sid):
    professionals_json=[]
    professionals=Service_Professional.query.filter_by(Service_id=sid, Status="approved")
    for professional in professionals:
            this_professional={}
            this_professional['ID']=professional.ID
            this_professional['Name']=professional.Name
            this_professional['BasePrice']=professional.BasePrice
            this_professional['Location']=professional.Location
            professionals_json.append(this_professional)
    return jsonify(professionals_json)

@app.route('/api/create_service_request/<int:pid>/<int:uid>', methods=['POST'])
@auth_required('token')
def create_service(pid,uid):
    customer_id=Customer.query.filter_by(User_id=uid).first().ID
    service_id=Service_Professional.query.filter_by(ID=pid).first().Service_id
    data = request.get_json()
    date=request.get_json('Date')
    new_request=Service_Request(Service_id=service_id,Customer_id=customer_id, Professional_id=pid, Date=date, Status='assigned')
    db.session.add(new_request)
    db.session.commit()
    return jsonify({"message" : "request created"}), 200

@app.route('/api/servicereqscus/<int:uid>')
@auth_required('token')
def serv_reqs_cus(uid):
    servicereqs_json=[]
    cid=Customer.query.filter_by(User_id=uid).first().ID
    service_reqs=Service_Request.query.filter_by(Customer_id=cid)
    for req in service_reqs:
        servicename=Service.query.filter_by(ID=req.Service_id).first().Name
        profname=Service_Professional.query.filter_by(ID=req.Professional_id).first().Name
        this_req={}
        this_req['ID']=req.ID
        this_req['ServiceName']=servicename
        this_req['ProfName']=profname
        this_req['Date']=req.Date
        this_req['Status']=req.Status
        servicereqs_json.append(this_req)
    return jsonify(servicereqs_json)

@app.route('/api/close_req/<int:srid>')
@auth_required('token')
def close_service(srid):
    servicereq=Service_Request.query.get(srid)
    servicereq.Status="closed"
    db.session.commit()
    return jsonify({"message" : "request closed"}), 200

@app.route('/api/getassigned_serv/<int:uid>')
@auth_required('token')
def assigned_service(uid):
    assigned_services_json=[]
    profid=Service_Professional.query.filter_by(User_id=uid).first().ID
    assigned_services=Service_Request.query.filter_by(Professional_id=profid, Status='assigned')
    for req in assigned_services:
        this_req={}
        custname=Customer.query.filter_by(ID=req.Customer_id).first().Name
        this_req['ID']=req.ID
        this_req['CustName']=custname
        this_req['Date']=req.Date
        assigned_services_json.append(this_req)
    return jsonify(assigned_services_json)

@app.route('/api/getaccepted_serv/<int:uid>')
@auth_required('token')
def accepted_service(uid):
    accepted_services_json=[]
    profid=Service_Professional.query.filter_by(User_id=uid).first().ID
    accepted_services=Service_Request.query.filter_by(Professional_id=profid, Status='accepted')
    for req in accepted_services:
        this_req={}
        custname=Customer.query.filter_by(ID=req.Customer_id).first().Name
        this_req['ID']=req.ID
        this_req['CustName']=custname
        this_req['Date']=req.Date
        accepted_services_json.append(this_req)
    return jsonify(accepted_services_json)

@app.route('/api/getclosed_serv/<int:uid>')
@auth_required('token')
def closed_service(uid):
    closed_services_json=[]
    profid=Service_Professional.query.filter_by(User_id=uid).first().ID
    closed_services=Service_Request.query.filter_by(Professional_id=profid, Status='closed')
    for req in closed_services:
        this_req={}
        custname=Customer.query.filter_by(ID=req.Customer_id).first().Name
        this_req['ID']=req.ID
        this_req['CustName']=custname
        this_req['Date']=req.Date
        closed_services_json.append(this_req)
    return jsonify(closed_services_json)

@app.route('/api/accept_req/<int:srid>')
@auth_required('token')
def accept_service(srid):
    servicereq=Service_Request.query.get(srid)
    servicereq.Status="accepted"
    db.session.commit()
    return jsonify({"message" : "request accepted"}), 200

@app.route('/api/reject_req/<int:srid>')
@auth_required('token')
def reject_service(srid):
    servicereq=Service_Request.query.get(srid)
    servicereq.Status="rejected"
    db.session.commit()
    return jsonify({"message" : "request rejected"}), 200



@app.get('/get-csv/<id>')
def getCSV(id):
    result = AsyncResult(id)

    if result.ready():
        return send_file(f'./backend/celery/{result.result}')
    else:
        return {'message' : 'task not ready'}


@app.get('/create-csv')
def createCSV():
    task = create_csv.delay()
    return {'task_id' : task.id}




@app.route('/report')
def send_reports():
    res = monthly_report.delay()
    return {
        "result": res.result
    }

'''@app.get('/get-main/<id>')
def getmail(id):
    result = AsyncResult(id)
    if result.ready():
        return {"result": result.result}
    else:
        return {'message' : 'task not ready'}'''