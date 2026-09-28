#!/usr/bin/env python3
"""Build the static page, reconstructing large media from verified transfer parts."""
from pathlib import Path
import hashlib
import json
import shutil

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / 'dist'
DEST.mkdir(exist_ok=True)
for name in ['index.html', 'styles.css', 'script.js', '.nojekyll']:
    shutil.copy2(ROOT / name, DEST / name)
shutil.copytree(ROOT / 'assets', DEST / 'assets', dirs_exist_ok=True)
for entry in json.loads((ROOT / '.media/manifest.json').read_text()):
    target = DEST / entry['path']
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists() and hashlib.sha256(target.read_bytes()).hexdigest() == entry['sha256']:
        continue
    digest = hashlib.sha256()
    with target.open('wb') as output:
        for part in entry['parts']:
            data = (ROOT / part).read_bytes()
            digest.update(data)
            output.write(data)
    if digest.hexdigest() != entry['sha256']:
        raise RuntimeError('Media integrity check failed: ' + entry['path'])
print('Built static website with verified media in dist/')
