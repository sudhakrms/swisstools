import { TOOLS, getTool } from './tools/registry.js';

const { h, render, Fragment } = window.preact;
const { useState, useEffect, useCallback, useRef } = window.preactHooks;

// ── LocalStorage helpers ─────────────────────────────────────────
const LS_FAVS   = 'parikaraalu_favs';
const LS_RECENT = 'parikaraalu_recent';
const LS_THEME  = 'parikaraalu_theme';

const getFavs   = () => JSON.parse(localStorage.getItem(LS_FAVS)   || '[]');
const getRecent = () => JSON.parse(localStorage.getItem(LS_RECENT) || '[]');

function addRecent(slug) {
  const prev = getRecent().filter(s => s !== slug);
  localStorage.setItem(LS_RECENT, JSON.stringify([slug, ...prev].slice(0, 4)));
}

function toggleFav(slug) {
  const favs = getFavs();
  const next  = favs.includes(slug) ? favs.filter(s => s !== slug) : [slug, ...favs];
  localStorage.setItem(LS_FAVS, JSON.stringify(next));
  return next;
}

// ── Dynamic tool loader ──────────────────────────────────────────
const toolCache = {};
async function loadTool(slug) {
  if (toolCache[slug]) return toolCache[slug];
  const mod = await import(`./tools/${slug}/tool.js`);
  toolCache[slug] = mod;
  return mod;
}

// ── ToolCard ─────────────────────────────────────────────────────
function ToolCard({ tool, favs, onToggleFav, onOpen }) {
  const isFav = favs.includes(tool.slug);
  return h('div', {
    class: 'tool-card',
    style: `--card-tint: var(${tool.tint})`,
    onClick: () => onOpen(tool.slug),
  },
    h('button', {
      class: `tool-fav ${isFav ? 'active' : ''}`,
      title: isFav ? 'Remove favourite' : 'Add to favourites',
      onClick: (e) => { e.stopPropagation(); onToggleFav(tool.slug); },
    }, isFav ? '♥' : '♡'),
    h('div', { class: 'tool-icon-wrap' }, tool.icon),
    h('div', null,
      h('div', { class: 'tool-name' }, tool.name),
      h('div', { class: 'tool-desc' }, tool.description),
    ),
  );
}

// ── Home Page ────────────────────────────────────────────────────
function HomePage({ onNavigate }) {
  const [query, setQuery]   = useState('');
  const [favs, setFavs]     = useState(getFavs);
  const [recent, setRecent] = useState(getRecent);

  const handleToggleFav = (slug) => setFavs(toggleFav(slug));

  const handleOpen = (slug) => {
    addRecent(slug);
    setRecent(getRecent());
    onNavigate(slug);
  };

  const filtered = query.trim()
    ? TOOLS.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.keywords.some(k => k.includes(query.toLowerCase()))
      )
    : null;

  const recentTools  = recent.map(s => getTool(s)).filter(Boolean);
  const favTools     = favs.map(s => getTool(s)).filter(Boolean);
  const displayTools = filtered ?? TOOLS;

  return h('div', { class: 'container' },
    h('div', { class: 'hero' },
      h('h1', { class: 'hero-title' }, '⚙️ Parikaraalu'),
      h('p',  { class: 'hero-subtitle' }, 'Tiny tools. Beautifully done.'),
      h('div', { class: 'search-wrap' },
        h('span', { class: 'search-icon' }, '🔍'),
        h('input', {
          class: 'search-input',
          type: 'search',
          placeholder: 'Search tools…',
          value: query,
          onInput: (e) => setQuery(e.target.value),
          autoFocus: true,
        }),
      ),
    ),

    // Search results
    filtered && h('div', { class: 'section' },
      filtered.length === 0
        ? h('div', { class: 'empty-state' },
            h('div', { class: 'empty-state-icon' }, '🔍'),
            h('div', { class: 'empty-state-text' }, `No tools found for "${query}"`),
          )
        : h('div', null,
            h('div', { class: 'section-header' },
              h('div', { class: 'section-title' }, `Results (${filtered.length})`),
            ),
            h('div', { class: 'tools-grid' },
              filtered.map(t => h(ToolCard, { key: t.slug, tool: t, favs, onToggleFav: handleToggleFav, onOpen: handleOpen }))
            ),
          )
    ),

    // Recent (hidden when searching)
    !filtered && recentTools.length > 0 && h('div', { class: 'section' },
      h('div', { class: 'section-header' },
        h('div', { class: 'section-title' }, 'Recently Used'),
      ),
      h('div', { class: 'tools-grid' },
        recentTools.map(t => h(ToolCard, { key: t.slug, tool: t, favs, onToggleFav: handleToggleFav, onOpen: handleOpen }))
      ),
    ),

    // Favourites (hidden when searching)
    !filtered && favTools.length > 0 && h('div', { class: 'section' },
      h('div', { class: 'section-header' },
        h('div', { class: 'section-title' }, 'Favourites'),
      ),
      h('div', { class: 'tools-grid' },
        favTools.map(t => h(ToolCard, { key: t.slug, tool: t, favs, onToggleFav: handleToggleFav, onOpen: handleOpen }))
      ),
    ),

    // All tools (hidden when searching)
    !filtered && h('div', { class: 'section' },
      h('div', { class: 'section-header' },
        h('div', { class: 'section-title' }, 'All Tools'),
        h('span', { class: 'badge' }, `${TOOLS.length} tools`),
      ),
      h('div', { class: 'tools-grid' },
        TOOLS.map(t => h(ToolCard, { key: t.slug, tool: t, favs, onToggleFav: handleToggleFav, onOpen: handleOpen }))
      ),
    ),
  );
}

// ── Tool Page Wrapper ────────────────────────────────────────────
function ToolPage({ slug, onBack }) {
  const [ToolComponent, setToolComponent] = useState(null);
  const [err, setErr] = useState(null);
  const tool = getTool(slug);

  useEffect(() => {
    setToolComponent(null);
    loadTool(slug)
      .then(mod => {
        const name = Object.keys(mod).find(k => typeof mod[k] === 'function');
        if (name) setToolComponent(() => mod[name]);
        else setErr('Tool not found');
      })
      .catch(() => setErr('Failed to load tool'));
  }, [slug]);

  return h('div', { class: 'page' },
    h('div', { class: 'tool-page', style: 'padding-top: 0' },
      !ToolComponent && !err && h('div', { style: 'display:flex; justify-content:center; padding: var(--space-10)' },
        h('div', { class: 'spinner', style: 'width:32px;height:32px;border-width:3px' }),
      ),
      err && h('div', { class: 'empty-state' },
        h('div', { class: 'empty-state-icon' }, '⚠️'),
        h('div', { class: 'empty-state-text' }, err),
      ),
      ToolComponent && h(ToolComponent),
    ),
  );
}

// ── Nav ──────────────────────────────────────────────────────────
function Nav({ route, onHome, theme, onToggleTheme }) {
  const tool = route !== 'home' ? getTool(route) : null;
  return h('nav', { class: 'nav' },
    tool
      ? h('button', { class: 'nav-back', onClick: onHome },
          h('span', { class: 'nav-back-arrow' }, '‹'),
          'Parikaraalu',
        )
      : h('div', { class: 'nav-brand', onClick: onHome },
          h('div', { class: 'nav-brand-icon' }, '⚙'),
          'Parikaraalu',
        ),
    tool && h(Fragment, null,
      h('span', { style: 'color: var(--text-tertiary); font-size: 12px' }, '/'),
      h('span', { class: 'nav-title' }, tool.name),
    ),
    h('span', { class: 'nav-spacer' }),
    h('button', { class: 'theme-toggle', onClick: onToggleTheme, title: 'Toggle theme' },
      theme === 'dark' ? '☀️' : '🌙',
    ),
  );
}

// ── App Root ─────────────────────────────────────────────────────
function App() {
  const initTheme = () => {
    const saved = localStorage.getItem(LS_THEME);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(initTheme);
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.slice(2); // strip #/
    return hash || 'home';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(LS_THEME, theme);
  }, [theme]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.slice(2);
      setRoute(hash || 'home');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (slug) => {
    window.location.hash = `/${slug}`;
    setRoute(slug);
  };

  const goHome = () => {
    window.location.hash = '';
    setRoute('home');
  };

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return h(Fragment, null,
    h(Nav, { route, onHome: goHome, theme, onToggleTheme: toggleTheme }),
    h('main', { class: 'page' },
      route === 'home'
        ? h(HomePage, { onNavigate: navigate })
        : h(ToolPage, { slug: route, onBack: goHome }),
    ),
  );
}

// ── Mount ────────────────────────────────────────────────────────
render(h(App), document.getElementById('app'));
