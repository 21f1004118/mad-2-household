from celery import shared_task
from backend.models import *
import flask_excel
import time


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


