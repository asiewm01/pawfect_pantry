from storages.backends.azure_storage import AzureStorage
import os

STATICFILES_STORAGE = "your_project.storage_backends.AzureStaticStorage"

class AzureMediaStorage(AzureStorage):
    account_name = "pawfectmediastore"
    account_key = os.getenv("AZURE_ACCOUNT_KEY")
    azure_container = "media"
    expiration_secs = None