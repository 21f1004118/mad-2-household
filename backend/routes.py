from flask import current_app as app, request, jsonify, render_template
from flask_security import auth_required, verify_password, hash_password, roles_required, login_user, roles_accepted, current_user
from backend.models import *


datastore=app.security.datastore

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/protected')
@auth_required()
def protected():
    return '<h1> protected </h1>'

@app.route('/api/home')
@auth_required('token')
@roles_accepted('professional', 'customer', 'admin')#and
# @roles_accepted(['user', 'admin']) #OR
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


