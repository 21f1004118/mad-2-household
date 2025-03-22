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

class Service(db.Model):
    __tablename__='Service'
    ID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String)
    BasePrice = db.Column(db.Numeric)
    TimeReq=db.Column(db.String)
    Description=db.Column(db.String)

class Customer(db.Model):
    __tablename__='Customer'
    ID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String)
    User_id=db.Column(db.Integer, db.ForeignKey('User.ID'))
    Location=db.Column(db.String)

class Service_Professional(db.Model):
    __tablename__='Service_Professional'
    ID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String)
    Service = db.Column(db.String)
    BasePrice = db.Column(db.Integer)
    Service_id=db.Column(db.Integer, db.ForeignKey('Service.ID'))
    User_id=db.Column(db.Integer, db.ForeignKey('User.ID'))
    Status=db.Column(db.String)
    Location=db.Column(db.String)
    Document=db.Column(db.String)

class Service_Request(db.Model):
    __tablename__='Service_Request'
    ID = db.Column(db.Integer, primary_key=True)
    Service_id=db.Column(db.Integer, db.ForeignKey('Service.ID'))
    Customer_id=db.Column(db.Integer, db.ForeignKey('Customer.ID'))
    Professional_id=db.Column(db.Integer, db.ForeignKey('Service_Professional.ID'))
    Status=db.Column(db.String)
    Date=db.Column(db.String)
    Comments=db.Column(db.String)

