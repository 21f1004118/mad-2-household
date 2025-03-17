from flask import current_app as app, request, jsonify, render_template
from flask_security import auth_required, verify_password



datastore=app.security.datastore

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/protected')
@auth_required()
def protected():
    return '<h1> protected </h1>'

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(data)
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message" : "invalid inputs"}), 404
    
    user = datastore.find_user(email = email)

    if not user:
        return jsonify({"message" : "invalid email"}), 404
    
    if verify_password(password, user.password):
        return jsonify({'token' : user.get_auth_token(), 'email' : user.email, 'role' : user.roles[0].name, 'id' : user.ID})
    
    return jsonify({'message' : 'password wrong'}), 400