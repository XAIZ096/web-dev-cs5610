import json
import ast

# Point this at your extracted JSON file
with open('airbnb_sf_listings_500.json') as f:
    data = json.load(f)

keep = []
for d in data[:50]:
    # Fix amenities — stored as JSON string in the original
    amenities = d.get('amenities', [])
    if isinstance(amenities, str):
        try:
            amenities = json.loads(amenities)
        except:
            amenities = ast.literal_eval(amenities)

    keep.append({
        'id': d.get('id'),
        'name': d.get('name', ''),
        'description': d.get('description', ''),
        'picture_url': d.get('picture_url', ''),
        'host_name': d.get('host_name', ''),
        'host_picture_url': d.get('host_picture_url', ''),
        'host_is_superhost': d.get('host_is_superhost', 'f'),
        'price': d.get('price', ''),
        'amenities': amenities,
        'neighbourhood': d.get('neighbourhood_cleansed', ''),
        'room_type': d.get('room_type', ''),
        'review_scores_rating': d.get('review_scores_rating'),
        'number_of_reviews': d.get('number_of_reviews', 0),
        'instant_bookable': d.get('instant_bookable', 'f'),
        'availability_30': d.get('availability_30', 0),
        'availability_60': d.get('availability_60', 0),
        'bedrooms': d.get('bedrooms'),
        'beds': d.get('beds'),
        'accommodates': d.get('accommodates'),
    })

with open('listings.json', 'w') as f:
    json.dump(keep, f, indent=2)

print(f'Done — {len(keep)} listings written to listings.json')