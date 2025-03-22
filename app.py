from flask import Flask
from backend.config import LocalDevelopmentConfig
from backend.models import db, User, Role
from flask_security import Security, SQLAlchemyUserDatastore, hash_password, auth_required
from backend.resources import api

def createApp():
    app=Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)

    db.init_app(app)
    api.init_app(app)

    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore=datastore, register_blueprint=False)
    app.app_context().push()
    return app

app=createApp()

with app.app_context():
    db.create_all()

    userdatastore : SQLAlchemyUserDatastore = app.security.datastore

    userdatastore.find_or_create_role(name = 'admin')
    userdatastore.find_or_create_role(name = 'customer')
    userdatastore.find_or_create_role(name = 'professional')

    if (not userdatastore.find_user(Username = 'admin')):
        userdatastore.create_user(Username = 'admin', password = hash_password('password'), roles = ['admin'] )
    #if (not userdatastore.find_user(Username = 'user01@study.iitm.ac.in')):
    #    userdatastore.create_user(Username = 'user01@study.iitm.ac.in', password = hash_password('pass'), roles = ['user'] ) # for testing

    db.session.commit()

import backend.routes

if(__name__=='__main__'):
    app.run(debug=True)