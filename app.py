from flask import Flask
from backend.config import LocalDevelopmentConfig
from backend.models import db, User, Role
from backend.celery.celery_create import celery_init_app
from flask_security import Security, SQLAlchemyUserDatastore, hash_password, auth_required
from flask_caching import Cache
import flask_excel as excel


def createApp():
    app=Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)

    db.init_app(app)
    cache=Cache(app)

    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore=datastore, register_blueprint=False)
    app.cache=cache

    app.app_context().push()

    from backend.resources import api
    api.init_app(app)


    return app

app=createApp()

celery_app = celery_init_app(app)

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
import backend.celery.celery_beat
excel.init_excel(app)

if(__name__=='__main__'):
    app.run(debug=True)