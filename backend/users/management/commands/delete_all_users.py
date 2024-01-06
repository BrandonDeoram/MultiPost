from django.core.management.base import BaseCommand
from users.models import NewUser

class Command(BaseCommand):
    help = 'Delete all data from the NewUser model'

    def handle(self, *args, **options):
        NewUser.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Successfully deleted all data from NewUser model.'))
