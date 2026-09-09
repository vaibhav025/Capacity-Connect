const fs = require('fs');
const tree = `src/
├── App.tsx
├── main.tsx
├── styles.css
├── motion.css
├── components/
│   ├── layout/
│   │   ├── LenisSmoothScroll.tsx
│   │   ├── InteractiveHero.tsx
│   │   ├── AnimatedPageTransition.tsx
│   │   └── Shell.tsx
│   ├── ui/
│   │   ├── AnimatedButtons.tsx
│   │   ├── ScrollRevealWrapper.tsx
│   │   ├── Tooltips.tsx
│   │   ├── SkeletonLoaders.tsx
│   │   ├── PageTitle.tsx
│   │   └── Stat.tsx
│   ├── trainee/
│   │   ├── CourseCatalogCard.tsx
│   │   ├── AssessmentPlayer.tsx
│   │   └── AnimatedProgressRing.tsx
│   ├── trainer/
│   │   ├── DragDropContentUploader.tsx
│   │   └── QuestionnaireBuilder.tsx
│   └── admin/
│       ├── InteractiveKPICharts.tsx
│       ├── UserApprovalTable.tsx
│       └── CompetencyMatchModal.tsx
├── data/demo.ts
├── lib/supabase.ts
├── pages/ (role screens and route composition)
└── types/
    ├── domain.ts
    └── vanta.d.ts`;
let guide = `# Capacity Connect motion implementation

## Installation commands

Run from the project directory:

\`\`\`powershell
npm install framer-motion@13.2.0 three@0.134.0 vanta@0.5.24 lucide-react@0.468.0 @studio-freight/lenis@1.0.42 recharts@3.10.1 tailwindcss@4.3.3 @tailwindcss/vite@4.3.3
npm install -D @types/three@0.134.0 @types/node@26.5.0
\`\`\`

For this checked-out implementation, use \`npm ci\` to reproduce package-lock.json.
The requested @studio-freight/lenis package is deprecated in favor of lenis; it is retained to match the request. Three r134 matches Vanta's documented integration: [Vanta documentation](https://github.com/tengbao/vanta#readme).

## Directory tree

\`\`\`text
${tree}
\`\`\`

## Complete critical component code

These are exact copies of the implementation, not abbreviated examples. Supporting imports, global styling, and root integration follow the four components.
`;
const files = [
 ['A. Global Lenis wrapper', 'src/components/layout/LenisSmoothScroll.tsx'],
 ['B. Interactive Vanta hero', 'src/components/layout/InteractiveHero.tsx'],
 ['C. Scroll-linked reveal', 'src/components/ui/ScrollRevealWrapper.tsx'],
 ['D. Interactive course card', 'src/components/trainee/CourseCatalogCard.tsx'],
 ['Supporting progress ring', 'src/components/trainee/AnimatedProgressRing.tsx'],
 ['Supporting animated button', 'src/components/ui/AnimatedButtons.tsx'],
 ['Supporting tooltip', 'src/components/ui/Tooltips.tsx'],
 ['Domain types', 'src/types/domain.ts'], ['Vanta declaration', 'src/types/vanta.d.ts'],
 ['Application root', 'src/main.tsx'], ['Tailwind and API proxy', 'vite.config.ts'],
 ['Tailwind entry', 'src/motion.css'], ['Complete global styles', 'src/styles.css'],
];
for (const [title, file] of files) guide += `\n### ${title}\n\nFile: \`${file}\`\n\n\`\`\`${file.endsWith('.css') ? 'css' : 'tsx'}\n${fs.readFileSync(file, 'utf8').trim()}\n\`\`\`\n`;
guide += `
## Verification and practical limits

Run \`npm run typecheck\`, \`npm run build\`, and, with \`npm run dev\` running, \`npm run test:e2e\`. Browser tests use locally installed Microsoft Edge; change the channel in playwright.config.ts for a different CI browser.

The four critical components are integrated into the application. Vanta and Three load only on the hero. Cleanup cancels Vanta's loop and listeners, disposes its renderer, releases its context, disconnects observers, and invalidates pending imports. Lenis has one RAF loop and responds to live reduced-motion changes. Touch scrolling stays native. Quick actions work on focus and touch as well as hover.

The full LMS remains a demo: login simulates roles; user approvals, bookmarks, content drafts and questionnaires are session-local; practice results are not recorded. Existing secondary screens retain prototype actions. Live production use requires authenticated API authorization, persistent authoring, signed Storage uploads, and assessment submission services. Competency matching uses the existing Node endpoint through Vite's /api proxy and explicitly labels server demo results. Production must supply its own working /api routing.

Three's lazy chunk exceeds Vite's default 500 kB warning threshold. The build succeeds; no frame-rate guarantee is claimed for untested devices. Browser verification checks lifecycle calls and canvas ownership, not a long-duration GPU memory profile.

Search Summary
- Commands: webcmd --version; webcmd web fetch --url https://github.com/tengbao/vanta; web open for the Vanta README and Lenis v1.0.42 repository URL.
- Sources fetched: https://github.com/tengbao/vanta (web tool); installed Vanta and Lenis package source/declarations.
- Browser fallback: no documentation browser used; no connected browser was available. Isolated Edge used for local application tests.
- Gaps/failures: Webcmd returned FETCH_BLOCKED; the Lenis repository URL returned an internal fetch error. Installed package declarations were used to verify the Lenis options.
`;
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/MOTION-IMPLEMENTATION.md', guide);
