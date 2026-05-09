#!/usr/bin/env python3
"""
VoluntYouth Scraper
Fetches volunteer opportunities from multiple sources and saves to opportunities.json
Run weekly via GitHub Actions or manually: python scraper.py

Install requirements:
pip install requests feedparser beautifulsoup4
"""

import requests
import json
from datetime import datetime
import feedparser

opportunities = []

print("🔍 VoluntYouth Scraper Started")
print("=" * 50)

# ============================================================
# SOURCE 1: VolunteerMatch RSS (FREE, no API key needed)
# ============================================================
print("Scraping VolunteerMatch...")
try:
    categories = ['animals', 'environment', 'education']
    for category in categories:
        feed_url = f'https://www.volunteermatch.org/search/opportunities.rss?c={category}'
        feed = feedparser.parse(feed_url)
        
        for entry in feed.entries[:5]:  # Limit to 5 per category
            opportunities.append({
                'title': entry.get('title', '').strip(),
                'org_name': entry.get('author', 'Unknown Organization').strip(),
                'description': entry.get('summary', '')[:150].replace('<p>', '').replace('</p>', '').strip(),
                'source_url': entry.get('link', ''),
                'source': 'volunteermatch',
                'cause': category,
                'type': 'ongoing',
                'distance': round(3.5 + (hash(entry.get('title', '')) % 10), 1)  # Fake distance
            })
    vm_count = len([o for o in opportunities if o['source'] == 'volunteermatch'])
    print(f"✓ Got {vm_count} from VolunteerMatch")
except Exception as e:
    print(f"✗ VolunteerMatch failed: {e}")


# ============================================================
# SOURCE 2: Simple Local Opportunities (Manually Added)
# ============================================================
print("Adding local opportunities...")
local_opps = [
    {
        'title': 'Trail Cleanup at Riverside Park',
        'org_name': 'Springfield Parks & Recreation',
        'description': 'Join us for monthly trail cleanups. All tools provided, ages 8+.',
        'source_url': 'https://www.springfield.gov/parks/volunteer',
        'source': 'local',
        'cause': 'environment',
        'type': 'one-time',
        'distance': 4.1
    },
    {
        'title': 'Library Reading Buddy',
        'org_name': 'Springfield Public Library',
        'description': 'Read with elementary school children. Help them discover their love of reading.',
        'source_url': 'https://www.springfield-library.org/volunteer',
        'source': 'local',
        'cause': 'education',
        'type': 'ongoing',
        'distance': 1.8
    },
    {
        'title': 'Animal Shelter Helper',
        'org_name': 'Paws & Care Animal Shelter',
        'description': 'Walk dogs, help with animal care, learn about rescue work.',
        'source_url': 'https://www.pawscare.org/volunteer',
        'source': 'local',
        'cause': 'animals',
        'type': 'ongoing',
        'distance': 2.3
    }
]
opportunities.extend(local_opps)
print(f"✓ Added {len(local_opps)} local opportunities")


# ============================================================
# SOURCE 3: Meetup Events (Free API, no auth needed)
# ============================================================
print("Scraping Meetup...")
try:
    # Using Meetup API without authentication (public data)
    meetup_url = 'https://api.meetup.com/2/events'
    params = {
        'city': 'Springfield',
        'keywords': 'volunteer',
        'fields': 'name,description,event_url'
    }
    
    response = requests.get(meetup_url, params=params, timeout=5)
    if response.status_code == 200:
        data = response.json()
        meetup_added = 0
        for event in data.get('results', [])[:3]:
            opportunities.append({
                'title': event.get('name', 'Meetup Event'),
                'org_name': 'Community Group',
                'description': event.get('description', '')[:150].strip(),
                'source_url': event.get('event_url', ''),
                'source': 'meetup',
                'cause': 'community',
                'type': 'one-time',
                'distance': round(5.0 + (hash(event.get('name', '')) % 5), 1)
            })
            meetup_added += 1
        print(f"✓ Got {meetup_added} from Meetup")
    else:
        print(f"✗ Meetup API returned status {response.status_code}")
except Exception as e:
    print(f"✗ Meetup failed: {e}")


# ============================================================
# SAVE TO JSON
# ============================================================
print("=" * 50)
output = {
    'last_updated': datetime.now().isoformat(),
    'total_opportunities': len(opportunities),
    'opportunities': opportunities[:50]  # Limit to 50 for MVP
}

# Write to file
with open('opportunities.json', 'w') as f:
    json.dump(output, f, indent=2)

print(f"✓ Scraped {len(opportunities)} total opportunities")
print(f"✓ Saved to opportunities.json")
print(f"✓ Last updated: {output['last_updated']}")
print("=" * 50)
print("✅ Scraper completed successfully!")
