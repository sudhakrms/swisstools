const { h } = window.preact;
const { useState, useEffect, useRef, useCallback } = window.preactHooks;

const LS_PALETTE = 'tool_color_palette';

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return '#' + [r,g,b].map(v => Math.round(v).toString(16).padStart(2,'0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r*255), g: Math.round(g*255), b: Math.round(b*255) };
}

function isLight(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (0.299*r + 0.587*g + 0.114*b) > 128;
}

function useToast() {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const timerRef = useRef(null);
  const toast = (m) => {
    setMsg(m); setShow(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShow(false), 2000);
  };
  return { msg, show, toast };
}

export function ColorPicker() {
  const [hex, setHex]     = useState('#007AFF');
  const [palette, setPalette] = useState([]);
  const { msg, show, toast } = useToast();

  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(LS_PALETTE) || '[]');
    setPalette(saved);
  }, []);

  const savePalette = (p) => {
    setPalette(p);
    localStorage.setItem(LS_PALETTE, JSON.stringify(p));
  };

  const addToPalette = () => {
    if (palette.includes(hex)) { toast('Already in palette'); return; }
    const next = [hex, ...palette].slice(0, 20);
    savePalette(next);
    toast('Added to palette');
  };

  const removeFromPalette = (color) => {
    savePalette(palette.filter(c => c !== color));
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => toast(`Copied: ${text}`));
  };

  const handleHslChange = (field, val) => {
    const next = { h: hsl.h, s: hsl.s, l: hsl.l, [field]: Number(val) };
    const { r, g, b } = hslToRgb(next.h, next.s, next.l);
    setHex(rgbToHex(r, g, b));
  };

  const handleRgbChange = (field, val) => {
    const next = { r: rgb.r, g: rgb.g, b: rgb.b, [field]: Math.min(255, Math.max(0, Number(val))) };
    setHex(rgbToHex(next.r, next.g, next.b));
  };

  const handleHexInput = (val) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) setHex(val.toLowerCase());
  };

  const colorFg = isLight(hex) ? '#000' : '#fff';

  return h('div', { class: 'tool-page' },
    h('div', { class: 'tool-page-header' },
      h('div', { class: 'tool-page-icon', style: 'background: color-mix(in srgb, var(--tint-color) 15%, transparent)' }, '🎨'),
      h('div', null,
        h('div', { class: 'tool-page-title' }, 'Color Picker'),
        h('div', { class: 'tool-page-subtitle' }, 'HEX · RGB · HSL — pick, convert & copy'),
      ),
    ),

    // Big color swatch + native picker
    h('div', { class: 'card', style: 'margin-bottom: var(--space-4)' },
      h('div', {
        style: `background: ${hex}; height: 140px; border-radius: var(--radius-md); margin-bottom: var(--space-4);
                display:flex; align-items:center; justify-content:center; position:relative; cursor:pointer`,
        onClick: () => document.getElementById('native-picker')?.click(),
      },
        h('span', { style: `font-size: 28px; font-weight: 700; color: ${colorFg}; letter-spacing:1px; font-family: var(--font-mono)` }, hex.toUpperCase()),
        h('input', {
          id: 'native-picker',
          type: 'color',
          value: hex,
          style: 'position:absolute; opacity:0; width:0; height:0',
          onInput: (e) => setHex(e.target.value),
        }),
      ),

      // Action buttons
      h('div', { style: 'display:flex; gap: var(--space-2); flex-wrap:wrap' },
        h('button', { class: 'btn btn-secondary', style: 'flex:1', onClick: () => copy(hex.toUpperCase()) }, '⎘ HEX'),
        h('button', { class: 'btn btn-secondary', style: 'flex:1', onClick: () => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`) }, '⎘ RGB'),
        h('button', { class: 'btn btn-secondary', style: 'flex:1', onClick: () => copy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`) }, '⎘ HSL'),
        h('button', { class: 'btn btn-primary', onClick: addToPalette }, '+ Save'),
      ),
    ),

    // HEX input
    h('div', { class: 'card', style: 'margin-bottom: var(--space-4)' },
      h('div', { class: 'label' }, 'HEX'),
      h('input', {
        class: 'input',
        type: 'text',
        maxlength: 7,
        value: hex.toUpperCase(),
        onInput: (e) => handleHexInput(e.target.value),
        style: 'font-family: var(--font-mono); letter-spacing: 2px',
      }),

      h('div', { class: 'divider' }),

      // RGB sliders
      h('div', { class: 'label' }, 'RGB'),
      ['r','g','b'].map(ch =>
        h('div', { key: ch, style: 'display:flex; align-items:center; gap: var(--space-3); margin-bottom: var(--space-2)' },
          h('span', { style: 'width:14px; font-size: var(--text-sm); font-weight:600; text-transform:uppercase; color: var(--text-secondary)' }, ch),
          h('input', {
            type: 'range', min: 0, max: 255, value: rgb[ch],
            style: 'flex:1; accent-color: var(--accent)',
            onInput: (e) => handleRgbChange(ch, e.target.value),
          }),
          h('input', {
            type: 'number', min: 0, max: 255, value: rgb[ch],
            style: 'width:52px; text-align:center; font-size: var(--text-sm); height:32px; padding:0 4px; border:1.5px solid var(--separator); border-radius: var(--radius-sm); background: var(--bg-tertiary); color: var(--text-primary); font-family: var(--font)',
            onInput: (e) => handleRgbChange(ch, e.target.value),
          }),
        )
      ),

      h('div', { class: 'divider' }),

      // HSL sliders
      h('div', { class: 'label' }, 'HSL'),
      [
        { key: 'h', label: 'H', max: 360, unit: '°' },
        { key: 's', label: 'S', max: 100, unit: '%' },
        { key: 'l', label: 'L', max: 100, unit: '%' },
      ].map(({ key, label, max, unit }) =>
        h('div', { key, style: 'display:flex; align-items:center; gap: var(--space-3); margin-bottom: var(--space-2)' },
          h('span', { style: 'width:14px; font-size: var(--text-sm); font-weight:600; color: var(--text-secondary)' }, label),
          h('input', {
            type: 'range', min: 0, max, value: hsl[key],
            style: 'flex:1; accent-color: var(--accent)',
            onInput: (e) => handleHslChange(key, e.target.value),
          }),
          h('span', { style: 'width:46px; text-align:right; font-size: var(--text-sm); color: var(--text-secondary); font-family: var(--font-mono)' }, `${hsl[key]}${unit}`),
        )
      ),
    ),

    // Palette
    palette.length > 0 && h('div', { class: 'card' },
      h('div', { style: 'display:flex; justify-content:space-between; align-items:center; margin-bottom: var(--space-3)' },
        h('div', { class: 'label', style: 'margin:0' }, `Saved Palette (${palette.length})`),
        h('button', { class: 'btn-ghost btn', style: 'height:28px; font-size: var(--text-xs)', onClick: () => savePalette([]) }, 'Clear all'),
      ),
      h('div', { style: 'display: flex; flex-wrap: wrap; gap: var(--space-2)' },
        palette.map(c =>
          h('div', {
            key: c,
            title: c,
            style: `width:40px; height:40px; border-radius: var(--radius-md); background:${c};
                    cursor:pointer; border: 2px solid ${c===hex ? 'var(--accent)' : 'var(--separator)'};
                    transition: transform 0.15s; position:relative`,
            onClick: () => setHex(c),
            onDblClick: () => removeFromPalette(c),
          })
        )
      ),
      h('div', { style: 'margin-top: var(--space-2); font-size: var(--text-xs); color: var(--text-tertiary)' },
        'Click to select · Double-click to remove'
      ),
    ),

    // Toast
    h('div', { class: `copy-toast ${show ? 'show' : ''}` }, msg),
  );
}
