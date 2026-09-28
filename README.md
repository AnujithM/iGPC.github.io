# iGPC project website

Research project page for **iGPC: Generative Motion Priors for Object-Aware Humanoid Interaction**.

A responsive, dependency-free static website with the full highlight video at the top, real-robot result clips, the paper's method overview, simulation metrics, and the manuscript PDF. The provided paper is an anonymous ICRA 2027 submission; no author list or acceptance claim has been added.

## Run locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`. No build step or package installation is required.

## Publish on GitHub Pages

In **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/ (root)**, and save. All asset paths are relative, so the page supports the repository's project URL and a custom domain.

The repository is currently private. GitHub Pages availability for private repositories depends on the account plan. Enabling a public project page may require a supported plan or an explicit decision to make this repository public.

## Update content

- Page content and metrics: `index.html`
- Visual style and responsive layouts: `styles.css`
- Video chapters, figure expansion, navigation: `script.js`
- Highlight and result clips: `assets/videos/`
- Figures and posters: `assets/images/`
- Manuscript: `assets/paper/igpc.pdf`

Numerical results are explicitly labeled as simulation. Real-robot clips are qualitative demonstrations. Paper images, videos, and results come from the supplied iGPC materials; the page design is original, informed by the requested ADAPT, FADA, and Perceptive BFM project-page references.
