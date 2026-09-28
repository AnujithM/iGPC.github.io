# iGPC project website

**iGPC: Generative Motion Priors for Object-Aware Humanoid Interaction**

A responsive research project page with the full highlight video at the top, real-robot clips, an expandable method figure, simulation comparisons, and the manuscript PDF. The supplied paper is an anonymous ICRA 2027 submission; no author names or acceptance claims have been added.

![Project-page preview](preview-20260928.jpg)

## Publish

In **Settings → Pages**, set **Source** to **GitHub Actions**. The included **Build and publish project website** workflow publishes the complete site whenever `main` changes. You can also run it manually from the **Actions** tab.

GitHub Pages is not currently enabled, and the repository is private. Private-repository Pages availability depends on your GitHub plan. Repository visibility has not been changed.

## Preview locally

```bash
python3 scripts/build.py
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080`. No package installation is required.

## Content

- `index.html` — research copy, metrics, and section structure
- `styles.css` — responsive design
- `script.js` — chapter selection, media behavior, figure dialog
- `assets/` — figures, posters, fonts, and small media
- `.media/` — transfer parts for larger video/PDF files
- `scripts/build.py` — assembles media and verifies SHA-256 integrity

Larger media is split only for reliable repository transfer. The build reconstructs ordinary MP4 and PDF files; visitors receive standard files with native browser playback. You can replace an assembled asset locally; update its transfer parts and manifest before committing.

Numerical results are explicitly labeled as simulation; real-robot clips are qualitative demonstrations. The box benchmark retains each method's native simulator and control interface. All project figures, videos, and research claims come from the supplied iGPC materials. The page design is original, informed by the requested ADAPT, FADA, and Perceptive BFM references.

The existing MIT license is preserved. Inter is distributed under its included SIL Open Font License.
