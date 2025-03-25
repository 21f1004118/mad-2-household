from flask_restful import Api, Resource, request
from flask_security import auth_required, roles_required, roles_accepted, current_user
from .models import *
from flask import jsonify

api= Api()

'''def roles_list(roles):
    role_list = []
    for role in roles:
        role_list.append(role.name)
    return role_list'''


class hhApi(Resource):
    @auth_required('token')
    @roles_accepted('admin','customer', 'profesional')
    def get(self):
        services=[]
        services_json=[]
        professionals=[]
        professionals_json=[]
        #if "admin" in roles_list(current_user.roles):
        if current_user.roles[0]=='admin':
            professionals=Service_Professional.query.all()
            services=Service.query.all()
            
        for professional in professionals:
            this_professional={}
            this_professional['ID']=professional.ID
            this_professional['name']=professional.Name
            this_professional['Service']=professional.Service
            this_professional['BasePrice']=professional.BasePrice
            this_professional['Status']=professional.Status
            professionals_json.append(this_professional)
        
        
        for service in services:
            this_service={}
            this_service['ID']=service.ID
            this_service['name']=service.Name
            this_service['BasePrice']=service.BasePrice
            services_json.append(this_service)
        
        #if professionals_json or services_json:
        return jsonify({'services': services_json}, {'professionals': professionals_json}) 
        
        return {
            "message": "No transactions found" 
        }, 404
    
    @auth_required('token')
    @roles_accepted('admin')
    def post(self):
        data=request.get_json()
        try:
            name=data.get('Name')
            baseprice=data.get('BasePrice')
            timereq=data.get('Timereq')
            desc=data.get('Desc')

            newservice=Service(Name=name, BasePrice=baseprice, TimeReq=timereq, Description=desc )
            db.session.add(newservice)
            db.session.commit()
            return  {
                "message": "Service added" 
            }, 200
        except:
             {
                "message": "Error" 
            }, 404
             
    @auth_required('token')
    @roles_accepted('admin')
    def put(self, sid):
        data=request.get_json()
        try:
            name=data.get('Name')
            price=data.get('BasePrice')

            this_service=Service.query.filter_by(ID=sid).first()
            this_service.Name=name
            this_service.BasePrice=price
            db.session.add(this_service)
            db.session.commit()
            return  {
                "message": "Service updated" 
            }, 200
        except:
             {
                "message": "Error" 
            }, 404
    

    @auth_required('token')
    @roles_accepted('admin')
    def delete(self, sid):
        this_prof=Service_Professional.query.filter_by(Service_id=sid).first()
        print(this_prof)
        if this_prof:
            usr_id=this_prof.User_id
            db.session.query(Service_Request).filter_by(Service_id=sid).delete()
            db.session.query(Service_Professional).filter_by(Service_id=sid).delete()
            db.session.query(User).filter_by(ID=usr_id).delete()
        db.session.query(Service).filter_by(ID=sid).delete()
        db.session.commit()
        return  {
                "message": "Service deleted" 
            }, 200



api.add_resource(hhApi, '/api/get', '/api/create', '/api/update/<int:sid>', '/api/delete/<int:sid>')