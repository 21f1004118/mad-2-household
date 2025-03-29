from celery import shared_task
from backend.models import *
import flask_excel
import time
import requests
from jinja2 import Template
from backend.mail import send_email

@shared_task(ignore_result = False)
def add(x,y):
    time.sleep(10)
    return x+y

@shared_task(ignore_result = False, bind=True)
def create_csv(self):
    services=Service_Professional.query.all()
    task_id = self.request.id
    filename = f'Services_professionals.csv'
    column_names = [column.name for column in Service_Professional.__table__.columns]
    print(column_names)
    csv_out = flask_excel.make_response_from_query_sets(services, column_names = column_names, file_type='csv' )

    with open(f'./backend/celery/{filename}', 'wb') as file:
        file.write(csv_out.data)
    
    return filename


@shared_task()
def monthly_report():
    Customers=Customer.query.all()
    for customer in Customers:
        customer_data={}
        customer_data['Name']=customer.Name
        customer_data['mail']=f'{customer.Name}@iit.com'
        customer_reqs_data=[]
        cus_reqs=Service_Request.query.filter_by(Customer_id=customer.ID)
        for req in cus_reqs:
            this_req={}
            servicename=Service.query.filter_by(ID=req.Service_id).first().Name
            profname=Service_Professional.query.filter_by(ID=req.Professional_id).first().Name
            this_req['ID']=req.ID
            this_req['ServiceName']=servicename
            this_req['ProfName']=profname
            this_req['Date']=req.Date
            this_req['Status']=req.Status
            customer_reqs_data.append(this_req)
        customer_data['requests']=customer_reqs_data
        content = format_report('templates/mail_report.html', customer_data)
        send_email(customer_data['mail'], subject = "monthly requests data", content=content)
    return "success"


@shared_task()
def daily_reminder():
    servicereqs=Service_Request.query.filter_by(Status='assigned')
    if servicereqs:
        for req in servicereqs:
            ProfName=Service_Professional.query.filter_by(ID=req.Professional_id).first().Name
            text=f"Hello {ProfName}, you have an assigned service pending, kindly update the status"
            response = requests.post("https://chat.googleapis.com/v1/spaces/AAAAE_OWDT8/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=f34s1COj-OxsOTOzmRlYtqUfxT1vj0LjJIqWuLPkFDU", json = {"text": text})
            print(response.status_code)
    return "Reminder sent to user"





def format_report(html_template, data):
    with open(html_template) as file:
        template = Template(file.read())
        return template.render(data = data)