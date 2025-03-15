from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db=SQLAlchemy()

class User(db.Model, UserMixin):
    __tablename__='User'
    ID = db.Column(db.Integer, primary_key=True)
    email=db.Column(db.String)
    Username = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    fs_uniquifier=db.Column(db.String, unique=True)
    active=db.Column(db.Boolean, default=True)
    roles = db.relationship('Role', backref = 'bearer', secondary = 'user_roles')


class Role(db.Model, RoleMixin):
    ID = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True, nullable  = False)
    

class UserRoles(db.Model):
    ID = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('User.ID'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.ID'))


