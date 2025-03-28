from celery import shared_task
from backend.models import *
import flask_excel
import time
from jinja2 import Template
from backend.mail import send_email

@shared_task(ignore_result = False)
def add(x,y):
    time.sleep(10)
    return x+y

@shared_task(ignore_result = False, bind=True)
def create_csv(self):
    services=Service.query.all()
    task_id = self.request.id
    filename = f'Services.csv'
    column_names = [column.name for column in Service.__table__.columns]
    print(column_names)
    csv_out = flask_excel.make_response_from_query_sets(services, column_names = column_names, file_type='csv' )

    with open(f'./backend/celery/{filename}', 'wb') as file:
        file.write(csv_out.data)
    
    return filename


@shared_task(ignore_result = False)
def monthly_report():
    Customers=Customer.query.all()
    for customer in Customers:
        print(customer.Name)
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



def format_report(html_template, data):
    with open(html_template) as file:
        template = Template(file.read())
        return template.render(data = data)