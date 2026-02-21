import os
import django
import random
from datetime import timedelta
from django.utils import timezone

# Setup Django
import sys
sys.path.append('Farmhub-backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmhub_backend.settings')
django.setup()

from api.models import Land

def fix_timers():
    # Force a future timer for ALL lands that are not leased
    now = timezone.now()
    lands = Land.objects.exclude(status='leased')
    count = 0
    for land in lands:
        # Give them a random end date between 5 and 15 days from now
        land.auction_ends_at = now + timedelta(days=random.randint(5, 15))
        land.status = 'available'
        land.save()
        count += 1
        print(f"Forced Active Timer for: {land.title}")
    
    print(f"Total lands refreshed with active timers: {count}")

if __name__ == "__main__":
    fix_timers()
