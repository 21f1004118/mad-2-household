from flask import current_app as app
from backend.celery.tasks import monthly_report, daily_remainder
from celery.schedules import crontab

celery_app = app.extensions['celery']

@celery_app.on_after_configure.connect
def task(sender, **kwargs):
    sender.add_periodic_task(crontab('*/2'),monthly_report.s())
    sender.add_periodic_task(crontab('*/2'),daily_remainder.s())

