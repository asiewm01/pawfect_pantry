from django.apps import AppConfig

class MyAppsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'my_apps'

def ready(self):
    import my_apps.signals
