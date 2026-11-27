"""Refresh Nook's bundled snapshot. Requires Python 3 and internet access."""
import datetime, json, os, sys, subprocess, tempfile, urllib.parse
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
QUERY='[out:json][timeout:25];nwr["amenity"~"^(cafe|library)$"]["name"](around:1500,37.8697,-122.2591);out center;'
url=(sys.argv[1] if len(sys.argv)>1 else 'https://overpass-api.de/api/interpreter')
body=subprocess.check_output(['curl','-fsSL','--max-time','50','--get','--data-urlencode','data='+QUERY,'-A','Nook-Berkeley-class-project/1.0',url])
data=json.loads(body)
if data.get('remark'): raise RuntimeError(data['remark'])
places=[]
for e in data['elements']:
 t=e['tags']; p=e.get('center',e)
 if 'lat' not in p or 'lon' not in p: continue
 places.append(dict(id=e['type']+'/'+str(e['id']),name=t['name'],kind=t['amenity'],lat=p['lat'],lon=p['lon'],address=' '.join(filter(None,[t.get('addr:housenumber'),t.get('addr:street')])),hours=t.get('opening_hours',''),wifi=t.get('internet_access',''),access=t.get('access','')))
if not places: raise RuntimeError('Empty import; preserving previous snapshot.')
snapshot=dict(source=url,license='ODbL 1.0',query=QUERY,asOf=data['osm3s']['timestamp_osm_base'],imported=datetime.datetime.now(datetime.timezone.utc).date().isoformat(),places=sorted(places,key=lambda p:p['id']))
path=ROOT/'dist'/'places.json'
with tempfile.NamedTemporaryFile('w',dir=path.parent,delete=False) as f: json.dump(snapshot,f,ensure_ascii=False,indent=1); tmp=f.name
os.chmod(tmp,0o644)
os.replace(tmp,path)
print(len(places),'venues; OSM data as of',snapshot['asOf'])
