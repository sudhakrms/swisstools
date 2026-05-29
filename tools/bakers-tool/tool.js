const { h } = window.preact;
const { useState, useEffect, useCallback } = window.preactHooks;

// ── Data ─────────────────────────────────────────────────────────

// Ingredient densities: grams per cup (King Arthur Baking)
const INGREDIENTS = [
  // Flours
  { label: 'All-Purpose Flour',        g_cup: 120,  note: 'Spoon & level method' },
  { label: 'Bread Flour',              g_cup: 120,  note: 'Spoon & level method' },
  { label: 'Cake Flour',               g_cup: 120,  note: 'Spoon & level method' },
  { label: 'Whole Wheat Flour',        g_cup: 113 },
  { label: 'Almond Flour',             g_cup: 96 },
  { label: 'Coconut Flour',            g_cup: 128 },
  { label: 'Oat Flour',                g_cup: 92 },
  { label: 'Rye Flour',                g_cup: 106 },
  { label: 'Rice Flour (white)',       g_cup: 142 },
  { label: 'Self-Rising Flour',        g_cup: 113 },
  { label: 'Gluten-Free AP Flour',     g_cup: 156 },
  { label: 'Spelt Flour',              g_cup: 99 },
  { label: 'Cornmeal',                 g_cup: 156 },
  { label: 'Semolina',                 g_cup: 163 },
  // Sugars
  { label: 'Granulated Sugar',         g_cup: 198 },
  { label: 'Brown Sugar (packed)',     g_cup: 213 },
  { label: 'Powdered Sugar',           g_cup: 113 },
  { label: 'Caster / Superfine Sugar', g_cup: 190 },
  { label: 'Demerara Sugar',           g_cup: 220 },
  { label: 'Coconut Sugar',            g_cup: 154 },
  // Fats
  { label: 'Butter',                   g_cup: 227,  note: '1 stick = ½ cup = 113g' },
  { label: 'Coconut Oil',              g_cup: 226 },
  { label: 'Vegetable Oil',            g_cup: 198 },
  { label: 'Shortening',               g_cup: 184 },
  // Dairy
  { label: 'Milk',                     g_cup: 227 },
  { label: 'Buttermilk',               g_cup: 227 },
  { label: 'Heavy Cream',              g_cup: 227 },
  { label: 'Sour Cream',               g_cup: 227 },
  { label: 'Yogurt',                   g_cup: 227 },
  // Other
  { label: 'Rolled Oats',              g_cup: 89 },
  { label: 'Chocolate Chips',          g_cup: 170 },
  { label: 'Cocoa Powder',             g_cup: 84 },
  { label: 'Honey',                    g_cup: 336,  note: '1 tbsp = 21g' },
  { label: 'Maple Syrup',              g_cup: 312 },
  { label: 'Water',                    g_cup: 227 },
];

// Volume units in ml
const VOLUMES = [
  { label: 'Cups (US)',           ml: 236.588 },
  { label: 'Cups (Metric/AU)',    ml: 250 },
  { label: 'Tablespoons (tbsp)',  ml: 14.787 },
  { label: 'Teaspoons (tsp)',     ml: 4.929 },
  { label: 'Fluid Ounces (fl oz)', ml: 29.574 },
  { label: 'Millilitres (ml)',    ml: 1 },
  { label: 'Pint (US)',           ml: 473.176 },
  { label: 'Quart (US)',          ml: 946.353 },
];

const WEIGHTS = [
  { label: 'Grams (g)',     g: 1 },
  { label: 'Kilograms (kg)',g: 1000 },
  { label: 'Ounces (oz)',   g: 28.3495 },
  { label: 'Pounds (lb)',   g: 453.592 },
];

// Oven temps: [gas, C, F, description, typical]
const OVEN_MARKS = [
  [0.25, 110, 225, 'Very Cool', 'Meringues, slow drying'],
  [0.5,  120, 250, 'Very Cool', 'Slow custards'],
  [1,    140, 275, 'Slow',      'Rich fruit cakes'],
  [2,    150, 300, 'Slow',      'Dense loaf cakes'],
  [3,    170, 325, 'Mod. Slow', 'Pound cake, cheesecake'],
  [4,    180, 350, 'Moderate',  'Most cakes & cookies ★'],
  [5,    190, 375, 'Mod. Hot',  'Muffins, biscuits'],
  [6,    200, 400, 'Mod. Hot',  'Pastry, roasting'],
  [7,    220, 425, 'Hot',       'Bread, pizza, puff pastry'],
  [8,    230, 450, 'Very Hot',  'High-hydration bread'],
  [9,    240, 475, 'Very Hot',  'Artisan bread blast'],
  [10,   260, 500, 'Ext. Hot',  'Dutch oven bread, pizza'],
];

// Pans: [label, cups]
const PANS = [
  { label: 'Round 6" × 2"',           cups: 4  },
  { label: 'Round 8" × 1½"',          cups: 4  },
  { label: 'Round 8" × 2"',           cups: 6  },
  { label: 'Round 9" × 1½"',          cups: 6  },
  { label: 'Round 9" × 2"',           cups: 8  },
  { label: 'Round 10" × 2"',          cups: 11 },
  { label: 'Square 8" × 8" × 2"',     cups: 8  },
  { label: 'Square 9" × 9" × 2"',     cups: 10 },
  { label: 'Square 10" × 10" × 2"',   cups: 12 },
  { label: 'Rect. 9" × 13" × 2"',     cups: 14 },
  { label: 'Rect. 11" × 7" × 2"',     cups: 10 },
  { label: 'Loaf 8" × 4" × 2½"',      cups: 4  },
  { label: 'Loaf 8½" × 4½" × 2½"',   cups: 6  },
  { label: 'Loaf 9" × 5" × 3"',       cups: 8  },
  { label: 'Springform 9" × 2½"',     cups: 10 },
  { label: 'Springform 10" × 2½"',    cups: 12 },
  { label: 'Bundt 9" × 3"',           cups: 9  },
  { label: 'Bundt 10" × 3½"',         cups: 12 },
  { label: 'Tube 9" × 3"',            cups: 12 },
];

// ── Sub-components ────────────────────────────────────────────────

function TabBar({ tabs, active, onSelect }) {
  return h('div', { style: 'overflow-x: auto; padding-bottom: 2px; margin-bottom: var(--space-5)' },
    h('div', { class: 'pill-tabs', style: 'width: max-content' },
      tabs.map(t =>
        h('button', {
          key: t.id,
          class: `pill-tab ${active === t.id ? 'active' : ''}`,
          onClick: () => onSelect(t.id),
        }, t.label)
      )
    )
  );
}

// ── Tab 1: Ingredient Converter ──────────────────────────────────
function IngredientTab() {
  const [ingredient, setIngredient] = useState(0);
  const [fromVol, setFromVol]       = useState(0); // index in VOLUMES
  const [fromVal, setFromVal]       = useState('1');
  const [toUnit, setToUnit]         = useState(0); // index in WEIGHTS
  const [result, setResult]         = useState('');
  const [reverse, setReverse]       = useState(false); // weight→volume

  const ing = INGREDIENTS[ingredient];

  useEffect(() => {
    if (!reverse) {
      const ml    = parseFloat(fromVal) * VOLUMES[fromVol].ml;
      const cups  = ml / 236.588;
      const grams = cups * ing.g_cup;
      const w     = grams / WEIGHTS[toUnit].g;
      setResult(isNaN(w) ? '' : parseFloat(w.toPrecision(5)).toString());
    } else {
      const grams = parseFloat(fromVal) * WEIGHTS[toUnit].g;
      const cups  = grams / ing.g_cup;
      const ml    = cups * VOLUMES[fromVol].ml;
      setResult(isNaN(ml) ? '' : parseFloat((ml / VOLUMES[fromVol].ml).toPrecision(5)).toString());
    }
  }, [fromVal, fromVol, toUnit, ingredient, reverse]);

  const quickRefs = [0.25, 0.5, 1, 2].map(cups => {
    const g = cups * ing.g_cup;
    return `${cups === 0.25 ? '¼' : cups === 0.5 ? '½' : cups} cup = ${g}g`;
  });

  return h('div', null,
    // Ingredient select
    h('div', { class: 'field' },
      h('label', { class: 'label' }, 'Ingredient'),
      h('select', {
        class: 'select', style: 'width:100%; height:44px',
        value: ingredient,
        onChange: (e) => setIngredient(Number(e.target.value)),
      },
        INGREDIENTS.map((ing, i) => h('option', { key: i, value: i }, ing.label))
      ),
    ),

    // Converter row
    h('div', { class: 'converter-row', style: 'align-items: flex-end' },
      h('div', { class: 'converter-panel' },
        h('input', {
          class: 'converter-value',
          type: 'number', min: 0, placeholder: '0',
          value: fromVal,
          onInput: (e) => setFromVal(e.target.value),
        }),
        h('select', {
          class: 'select converter-unit-select',
          value: reverse ? toUnit : fromVol,
          onChange: (e) => reverse ? setToUnit(Number(e.target.value)) : setFromVol(Number(e.target.value)),
        },
          reverse
            ? WEIGHTS.map((u, i) => h('option', { key: i, value: i }, u.label))
            : VOLUMES.map((u, i) => h('option', { key: i, value: i }, u.label))
        ),
      ),
      h('button', {
        class: 'swap-btn',
        onClick: () => { setReverse(r => !r); setFromVal(result || '1'); },
        title: 'Swap direction',
      }, '⇄'),
      h('div', { class: 'converter-panel' },
        h('input', {
          class: 'converter-value',
          type: 'text', readOnly: true,
          placeholder: '—',
          value: result,
          style: 'color: var(--accent)',
        }),
        h('select', {
          class: 'select converter-unit-select',
          value: reverse ? fromVol : toUnit,
          onChange: (e) => reverse ? setFromVol(Number(e.target.value)) : setToUnit(Number(e.target.value)),
        },
          reverse
            ? VOLUMES.map((u, i) => h('option', { key: i, value: i }, u.label))
            : WEIGHTS.map((u, i) => h('option', { key: i, value: i }, u.label))
        ),
      ),
    ),

    ing.note && h('div', { class: 'info-box', style: 'margin-top: var(--space-4)' },
      h('span', null, 'ℹ️'),
      h('span', null, ing.note),
    ),

    // Quick ref
    h('div', { class: 'card', style: 'margin-top: var(--space-4)' },
      h('div', { class: 'label', style: 'margin-bottom: var(--space-3)' }, 'Quick Reference'),
      h('div', { style: 'display:flex; flex-wrap:wrap; gap: var(--space-2)' },
        quickRefs.map((r, i) => h('span', { key: i, class: 'badge' }, r))
      ),
    ),
  );
}

// ── Tab 2: Oven Temperature ──────────────────────────────────────
function OvenTab() {
  const [celsius, setCelsius] = useState('180');
  const [isFan, setIsFan]     = useState(false);

  const c   = parseFloat(celsius) || 0;
  const f   = Math.round(c * 9 / 5 + 32);
  const fan = c - 20;
  const fanF = Math.round(fan * 9 / 5 + 32);

  // Find closest gas mark
  const closest = OVEN_MARKS.reduce((best, row) =>
    Math.abs(row[1] - c) < Math.abs(best[1] - c) ? row : best, OVEN_MARKS[0]);

  return h('div', null,
    h('div', { class: 'converter-row', style: 'align-items: flex-end; margin-bottom: var(--space-4)' },
      h('div', { class: 'converter-panel' },
        h('div', { class: 'label' }, '°C'),
        h('input', {
          class: 'converter-value',
          type: 'number', placeholder: '180',
          value: celsius,
          onInput: (e) => setCelsius(e.target.value),
        }),
      ),
      h('div', { style: 'display:flex; flex-direction:column; align-items:center; gap: var(--space-1); padding-bottom: 8px' },
        h('span', { style: 'color: var(--text-tertiary); font-size: 18px' }, '↔'),
      ),
      h('div', { class: 'converter-panel' },
        h('div', { class: 'label' }, '°F'),
        h('input', {
          class: 'converter-value',
          type: 'number', placeholder: '356',
          value: c ? f : '',
          readOnly: true,
          style: 'color: var(--accent)',
        }),
      ),
    ),

    h('div', { style: 'display:grid; grid-template-columns:1fr 1fr; gap: var(--space-3); margin-bottom: var(--space-4)' },
      h('div', { class: 'card', style: 'text-align:center' },
        h('div', { class: 'label' }, 'Gas Mark'),
        h('div', { style: 'font-size: 28px; font-weight:700; color: var(--accent)' }, closest[0]),
      ),
      h('div', { class: 'card', style: 'text-align:center' },
        h('div', { class: 'label' }, 'Fan / Convection'),
        h('div', { style: 'font-size: 22px; font-weight:700; color: var(--accent-orange)' },
          c ? `${fan}°C / ${fanF}°F` : '—'
        ),
      ),
    ),

    h('div', { class: 'info-box', style: 'margin-bottom: var(--space-4)' },
      h('span', null, '🌡️'),
      h('div', null,
        h('strong', null, `${closest[3]} — Gas Mark ${closest[0]}`),
        h('div', null, closest[4]),
      ),
    ),

    // Full reference table
    h('div', { class: 'card' },
      h('div', { class: 'label', style: 'margin-bottom: var(--space-3)' }, 'Full Reference'),
      h('div', { style: 'overflow-x:auto' },
        h('table', { style: 'width:100%; border-collapse:collapse; font-size: var(--text-sm)' },
          h('thead', null,
            h('tr', { style: 'color: var(--text-secondary); text-align:left' },
              ['Gas', '°C', '°F', 'Fan°C', 'Description'].map(col =>
                h('th', { style: 'padding: 4px 8px; border-bottom: 1px solid var(--separator)' }, col)
              )
            )
          ),
          h('tbody', null,
            OVEN_MARKS.map(([gas, degC, degF, desc]) =>
              h('tr', {
                key: gas,
                style: `${Math.abs(degC - c) < 8 ? 'background: color-mix(in srgb, var(--tint-bakers) 8%, transparent)' : ''}`,
              },
                [gas, degC, degF, degC - 20, desc].map((v, i) =>
                  h('td', { style: 'padding: 5px 8px; border-bottom: 1px solid var(--separator)' }, v)
                )
              )
            )
          )
        )
      ),
    ),
  );
}

// ── Tab 3: Yeast Converter ────────────────────────────────────────
function YeastTab() {
  const [fromType, setFromType] = useState('active');
  const [amount, setAmount]     = useState('2.25');
  const [unit, setUnit]         = useState('tsp');

  const toGrams = (val, type, u) => {
    const n = parseFloat(val) || 0;
    if (u === 'tsp')   return type === 'fresh' ? n * 3.1 : n * 2.8;
    if (u === 'tbsp')  return type === 'fresh' ? n * 9.3 : n * 8.5;
    if (u === 'g')     return n;
    if (u === 'packet') return n * 7;
    return n;
  };

  const convert = (fromG, fromT, toT) => {
    // normalise to "active dry grams"
    let activeG;
    if (fromT === 'active')  activeG = fromG;
    if (fromT === 'instant') activeG = fromG / 0.75;
    if (fromT === 'fresh')   activeG = fromG / 3;

    let toG;
    if (toT === 'active')  toG = activeG;
    if (toT === 'instant') toG = activeG * 0.75;
    if (toT === 'fresh')   toG = activeG * 3;

    return parseFloat(toG.toPrecision(4));
  };

  const fromG  = toGrams(amount, fromType, unit);
  const types  = ['active', 'instant', 'fresh'];
  const labels = { active: 'Active Dry', instant: 'Instant / Fast-action', fresh: 'Fresh / Cake' };
  const notes  = {
    active:  'Proof in 105–115°F (40–46°C) water for 10 min before using.',
    instant: 'Add directly to dry ingredients — no proofing needed.',
    fresh:   'Crumble directly into dough. Store in fridge, use within 2 weeks.',
  };

  const others = types.filter(t => t !== fromType);

  return h('div', null,
    h('div', { class: 'field' },
      h('label', { class: 'label' }, 'Yeast I have'),
      h('div', { class: 'pill-tabs' },
        types.map(t =>
          h('button', {
            key: t, class: `pill-tab ${fromType === t ? 'active' : ''}`,
            onClick: () => setFromType(t),
          }, labels[t])
        )
      ),
    ),

    h('div', { class: 'converter-row', style: 'margin: var(--space-4) 0; align-items: flex-end' },
      h('div', { class: 'converter-panel' },
        h('input', {
          class: 'converter-value',
          type: 'number', min: 0, placeholder: '0',
          value: amount,
          onInput: (e) => setAmount(e.target.value),
        }),
        h('select', {
          class: 'select converter-unit-select',
          value: unit,
          onChange: (e) => setUnit(e.target.value),
        },
          [['tsp','Teaspoons'], ['tbsp','Tablespoons'], ['g','Grams'], ['packet','Packets (7g)']].map(([v,l]) =>
            h('option', { key: v, value: v }, l)
          )
        ),
      ),
    ),

    h('div', { class: 'info-box', style: 'margin-bottom: var(--space-4)' },
      h('span', null, 'ℹ️'),
      h('span', null, notes[fromType]),
    ),

    h('div', { class: 'card' },
      h('div', { class: 'label', style: 'margin-bottom: var(--space-4)' }, 'Equivalents'),
      others.map(toT =>
        h('div', {
          key: toT,
          style: 'display:flex; justify-content:space-between; align-items:center; padding: var(--space-3) 0; border-bottom: 1px solid var(--separator)',
        },
          h('span', { style: 'color: var(--text-secondary); font-size: var(--text-base)' }, labels[toT]),
          h('span', { style: 'font-size: var(--text-xl); font-weight:600; color: var(--accent)' },
            `${convert(fromG, fromType, toT)} g`
          ),
        )
      ),
    ),

    h('div', { class: 'card', style: 'margin-top: var(--space-4)' },
      h('div', { class: 'label', style: 'margin-bottom: var(--space-3)' }, 'Standard Equivalents'),
      h('div', { style: 'display:flex; flex-wrap:wrap; gap: var(--space-2)' },
        ['1 packet = 2¼ tsp = 7g active dry', '1 tsp active = 0.75 tsp instant', '7g active = 21g fresh'].map((r,i) =>
          h('span', { key: i, class: 'badge' }, r)
        )
      ),
    ),
  );
}

// ── Tab 4: Recipe Scaler ─────────────────────────────────────────
const LEAVENERS = ['baking powder', 'baking soda', 'yeast', 'bicarbonate'];
const SPICES    = ['cinnamon', 'nutmeg', 'vanilla', 'extract', 'spice', 'pepper', 'salt'];

function ScalerTab() {
  const [scale, setScale]       = useState(2);
  const [custom, setCustom]     = useState('');
  const [rows, setRows]         = useState([
    { name: 'All-Purpose Flour', amount: '2', unit: 'cups' },
    { name: 'Sugar',             amount: '1', unit: 'cups' },
    { name: 'Butter',            amount: '0.5', unit: 'cups' },
    { name: 'Baking Powder',     amount: '2', unit: 'tsp' },
    { name: 'Eggs',              amount: '2', unit: 'whole' },
    { name: 'Vanilla Extract',   amount: '1', unit: 'tsp' },
  ]);

  const effectiveScale = custom !== '' ? parseFloat(custom) || 1 : scale;

  const getWarning = (name, origAmt, scaledAmt) => {
    const n = name.toLowerCase();
    if (LEAVENERS.some(l => n.includes(l)) && effectiveScale > 2)
      return `⚠️ Leaveners don't scale linearly above 2× — consider using ${parseFloat((scaledAmt * 0.85).toPrecision(3))} instead`;
    if (SPICES.some(s => n.includes(s)) && effectiveScale > 1.5)
      return `⚠️ Scale spices/extracts to ~75% — consider ${parseFloat((scaledAmt * 0.75).toPrecision(3))}`;
    return null;
  };

  const addRow = () => setRows(r => [...r, { name: '', amount: '1', unit: 'cups' }]);
  const removeRow = (i) => setRows(r => r.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) => setRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row));

  const presetScales = [0.5, 1.5, 2, 3];

  return h('div', null,
    // Scale selector
    h('div', { class: 'card', style: 'margin-bottom: var(--space-4)' },
      h('div', { class: 'label', style: 'margin-bottom: var(--space-3)' }, 'Scale Factor'),
      h('div', { style: 'display:flex; align-items:center; gap: var(--space-3); flex-wrap:wrap' },
        h('div', { class: 'chip-group', style: 'margin:0' },
          presetScales.map(s =>
            h('button', {
              key: s,
              class: `chip ${scale === s && custom === '' ? 'active' : ''}`,
              onClick: () => { setScale(s); setCustom(''); },
            }, `×${s}`)
          )
        ),
        h('input', {
          type: 'number', min: 0.1, step: 0.1, placeholder: 'Custom…',
          value: custom,
          style: 'width:100px; height:36px; padding:0 var(--space-3); border:1.5px solid var(--separator); border-radius: var(--radius-md); background: var(--bg-tertiary); color: var(--text-primary); font-family: var(--font); font-size: var(--text-sm)',
          onInput: (e) => { setCustom(e.target.value); setScale(null); },
        }),
        h('span', { class: 'badge accent' }, `×${effectiveScale}`),
      ),
    ),

    // Ingredients table
    h('div', { class: 'card', style: 'margin-bottom: var(--space-4)' },
      rows.map((row, i) => {
        const orig   = parseFloat(row.amount) || 0;
        const scaled = parseFloat((orig * effectiveScale).toPrecision(4));
        const warn   = getWarning(row.name, orig, scaled);
        return h('div', { key: i, style: 'margin-bottom: var(--space-4); padding-bottom: var(--space-4); border-bottom: 1px solid var(--separator)' },
          h('div', { style: 'display:grid; grid-template-columns: 2fr 1fr 1fr auto; gap: var(--space-2); align-items:center' },
            h('input', {
              type: 'text', placeholder: 'Ingredient name',
              value: row.name,
              style: 'height:36px; padding:0 10px; border:1.5px solid var(--separator); border-radius: var(--radius-sm); background: var(--bg-tertiary); color: var(--text-primary); font-family: var(--font); font-size: var(--text-sm)',
              onInput: (e) => updateRow(i, 'name', e.target.value),
            }),
            h('input', {
              type: 'number', min: 0, placeholder: '0',
              value: row.amount,
              style: 'height:36px; padding:0 10px; border:1.5px solid var(--separator); border-radius: var(--radius-sm); background: var(--bg-tertiary); color: var(--text-primary); font-family: var(--font); font-size: var(--text-sm)',
              onInput: (e) => updateRow(i, 'amount', e.target.value),
            }),
            h('input', {
              type: 'text', placeholder: 'unit',
              value: row.unit,
              style: 'height:36px; padding:0 10px; border:1.5px solid var(--separator); border-radius: var(--radius-sm); background: var(--bg-tertiary); color: var(--text-primary); font-family: var(--font); font-size: var(--text-sm)',
              onInput: (e) => updateRow(i, 'unit', e.target.value),
            }),
            h('button', { class: 'btn btn-icon', style: 'color: var(--accent-red)', onClick: () => removeRow(i) }, '×'),
          ),
          h('div', { style: 'margin-top: var(--space-2); display:flex; align-items:center; gap: var(--space-2)' },
            h('span', { style: 'color: var(--text-secondary); font-size: var(--text-sm)' }, '→'),
            h('span', { style: 'font-size: var(--text-md); font-weight:600; color: var(--accent)' }, `${scaled} ${row.unit}`),
          ),
          warn && h('div', { class: 'info-box orange', style: 'margin-top: var(--space-2); font-size: var(--text-xs)' },
            h('span', null, warn)
          ),
        );
      }),
      h('button', { class: 'btn btn-secondary', style: 'width:100%; margin-top: var(--space-2)', onClick: addRow }, '+ Add Ingredient'),
    ),
  );
}

// ── Tab 5: Pan Substitution ──────────────────────────────────────
function PanTab() {
  const [fromPan, setFromPan] = useState(2); // 8" round × 2"
  const [toPan, setToPan]     = useState(4); // 9" round × 2"

  const fromCups = PANS[fromPan].cups;
  const toCups   = PANS[toPan].cups;
  const factor   = toCups / fromCups;
  const deeper   = toCups < fromCups;

  const advice = factor > 1.15
    ? `Deeper batter — ↓ temp by 5–10°C, ↑ baking time by ~15–25 min`
    : factor < 0.85
    ? `Shallower batter — ↑ temp by 5–10°C, ↓ baking time by ~10–15 min`
    : `Similar volume — minimal adjustment needed`;

  return h('div', null,
    h('div', { style: 'display:grid; grid-template-columns:1fr auto 1fr; gap: var(--space-3); align-items:end; margin-bottom: var(--space-4)' },
      h('div', null,
        h('label', { class: 'label' }, 'Recipe pan'),
        h('select', {
          class: 'select', style: 'width:100%; height:44px',
          value: fromPan,
          onChange: (e) => setFromPan(Number(e.target.value)),
        },
          PANS.map((p, i) => h('option', { key: i, value: i }, p.label))
        ),
      ),
      h('div', { style: 'display:flex; align-items:center; padding-bottom:8px' },
        h('span', { style: 'font-size:20px; color: var(--text-tertiary)' }, '→'),
      ),
      h('div', null,
        h('label', { class: 'label' }, 'My pan'),
        h('select', {
          class: 'select', style: 'width:100%; height:44px',
          value: toPan,
          onChange: (e) => setToPan(Number(e.target.value)),
        },
          PANS.map((p, i) => h('option', { key: i, value: i }, p.label))
        ),
      ),
    ),

    h('div', { style: 'display:grid; grid-template-columns:1fr 1fr 1fr; gap: var(--space-3); margin-bottom: var(--space-4)' },
      h('div', { class: 'card', style: 'text-align:center' },
        h('div', { class: 'label' }, 'Recipe volume'),
        h('div', { style: 'font-size:24px; font-weight:700; color: var(--text-primary)' }, `${fromCups} cups`),
      ),
      h('div', { class: 'card', style: 'text-align:center' },
        h('div', { class: 'label' }, 'My pan volume'),
        h('div', { style: 'font-size:24px; font-weight:700; color: var(--text-primary)' }, `${toCups} cups`),
      ),
      h('div', { class: 'card', style: 'text-align:center' },
        h('div', { class: 'label' }, 'Scale ingredients'),
        h('div', { style: `font-size:24px; font-weight:700; color: var(--accent)` },
          factor === 1 ? '×1 (same)' : `×${parseFloat(factor.toPrecision(3))}`
        ),
      ),
    ),

    h('div', { class: `info-box ${factor < 0.85 ? '' : factor > 1.15 ? 'orange' : 'green'}` },
      h('span', null, factor > 1.15 ? '⏱️' : factor < 0.85 ? '🌡️' : '✅'),
      h('span', null, advice),
    ),
  );
}

// ── Tab 6: Baker's % ─────────────────────────────────────────────
const HYDRATION_GUIDE = [
  [0,  60,  'Very stiff — bagels, pretzels'],
  [60, 67,  'Firm — sandwich bread, dinner rolls'],
  [67, 75,  'Standard — most white & wholegrain loaves'],
  [75, 82,  'Moderate open crumb — sourdough, country loaves'],
  [82, 90,  'Slack, open crumb — ciabatta, high-hydration sourdough'],
  [90, 200, 'Very wet — focaccia, some artisan ciabatta'],
];

function BreadTab() {
  const [targetYield, setTargetYield] = useState('1000');
  const [rows, setRows] = useState([
    { name: 'Flour',   pct: '100' },
    { name: 'Water',   pct: '72'  },
    { name: 'Salt',    pct: '2'   },
    { name: 'Starter', pct: '20'  },
  ]);

  const totalPct = rows.reduce((s, r) => s + (parseFloat(r.pct) || 0), 0);
  const target   = parseFloat(targetYield) || 1000;
  const factor   = target / totalPct;
  const flourPct = parseFloat(rows[0]?.pct) || 100;
  const waterPct = parseFloat(rows.find(r => r.name.toLowerCase().includes('water'))?.pct) || 0;
  const hydration = waterPct; // water% relative to flour = hydration

  const hydGuide = HYDRATION_GUIDE.find(([lo, hi]) => hydration >= lo && hydration < hi);

  const addRow = () => setRows(r => [...r, { name: '', pct: '0' }]);
  const removeRow = (i) => setRows(r => r.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) => setRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row));

  return h('div', null,
    h('div', { class: 'card', style: 'margin-bottom: var(--space-4)' },
      h('label', { class: 'label' }, 'Target dough yield (g)'),
      h('input', {
        class: 'input',
        type: 'number', min: 0, placeholder: '1000',
        value: targetYield,
        onInput: (e) => setTargetYield(e.target.value),
      }),
    ),

    // Hydration badge
    hydration > 0 && h('div', { class: 'info-box green', style: 'margin-bottom: var(--space-4)' },
      h('span', null, '💧'),
      h('span', null, `Hydration: ${hydration}% — ${hydGuide ? hydGuide[2] : ''}`),
    ),

    // Formula table
    h('div', { class: 'card', style: 'margin-bottom: var(--space-4)' },
      h('div', { style: 'display:grid; grid-template-columns:2fr 1fr 1fr auto; gap: var(--space-2); margin-bottom: var(--space-3); color: var(--text-secondary); font-size: var(--text-xs); font-weight:600; text-transform:uppercase; letter-spacing:0.5px' },
        h('span', null, 'Ingredient'),
        h('span', null, 'Baker\'s %'),
        h('span', null, `→ Grams`),
        h('span', null, ''),
      ),
      rows.map((row, i) => {
        const g = parseFloat((factor * (parseFloat(row.pct) || 0)).toPrecision(4));
        return h('div', { key: i, style: 'display:grid; grid-template-columns:2fr 1fr 1fr auto; gap: var(--space-2); margin-bottom: var(--space-3); align-items:center' },
          h('input', {
            type: 'text', placeholder: 'Ingredient',
            value: row.name,
            style: 'height:36px; padding:0 10px; border:1.5px solid var(--separator); border-radius: var(--radius-sm); background: var(--bg-tertiary); color: var(--text-primary); font-family: var(--font); font-size: var(--text-sm)',
            onInput: (e) => updateRow(i, 'name', e.target.value),
          }),
          h('div', { style: 'display:flex; align-items:center; gap:4px' },
            h('input', {
              type: 'number', min: 0, step: 0.5,
              value: row.pct,
              style: 'width:100%; height:36px; padding:0 8px; border:1.5px solid var(--separator); border-radius: var(--radius-sm); background: var(--bg-tertiary); color: var(--text-primary); font-family: var(--font); font-size: var(--text-sm)',
              onInput: (e) => updateRow(i, 'pct', e.target.value),
            }),
            h('span', { style: 'color: var(--text-tertiary); font-size: var(--text-sm)' }, '%'),
          ),
          h('span', { style: 'font-size: var(--text-md); font-weight:600; color: var(--accent)' }, `${g}g`),
          h('button', { class: 'btn btn-icon', style: 'color: var(--accent-red)', onClick: () => removeRow(i) }, '×'),
        );
      }),
      h('div', { style: 'display:grid; grid-template-columns:2fr 1fr 1fr auto; gap: var(--space-2); padding-top: var(--space-3); border-top: 1px solid var(--separator)' },
        h('span', { style: 'font-weight:600' }, 'Total'),
        h('span', { style: 'font-weight:600; color: var(--text-secondary)' }, `${parseFloat(totalPct.toPrecision(5))}%`),
        h('span', { style: 'font-weight:600; color: var(--accent)' }, `${parseFloat(target.toPrecision(5))}g`),
        h('span', null),
      ),
      h('button', { class: 'btn btn-secondary', style: 'width:100%; margin-top: var(--space-3)', onClick: addRow }, '+ Add ingredient'),
    ),

    // Salt guide
    h('div', { class: 'info-box', style: 'margin-bottom: var(--space-4)' },
      h('span', null, 'ℹ️'),
      h('span', null, 'Salt: 1.8–2.2% is standard. Below 1.5% = bland; above 2.5% = inhibits yeast.'),
    ),
  );
}

// ── Main Component ────────────────────────────────────────────────
const TABS = [
  { id: 'ingredient', label: '⚖️ Ingredient' },
  { id: 'oven',       label: '🌡️ Oven'        },
  { id: 'yeast',      label: '🧫 Yeast'        },
  { id: 'scaler',     label: '✖️ Scaler'       },
  { id: 'pan',        label: '🥘 Pan'          },
  { id: 'bread',      label: '🍞 Bread %'      },
];

export function BakersTool() {
  const [tab, setTab] = useState(() =>
    localStorage.getItem('tool_bakers_tab') || 'ingredient'
  );

  const handleTab = (id) => {
    setTab(id);
    localStorage.setItem('tool_bakers_tab', id);
  };

  return h('div', { class: 'tool-page' },
    h('div', { class: 'tool-page-header' },
      h('div', { class: 'tool-page-icon', style: 'background: color-mix(in srgb, var(--tint-bakers) 15%, transparent)' }, '🍞'),
      h('div', null,
        h('div', { class: 'tool-page-title' }, "Baker's Tool"),
        h('div', { class: 'tool-page-subtitle' }, 'Ingredient · Oven · Yeast · Scaler · Pan · Bread%'),
      ),
    ),

    h(TabBar, { tabs: TABS, active: tab, onSelect: handleTab }),

    tab === 'ingredient' && h(IngredientTab),
    tab === 'oven'       && h(OvenTab),
    tab === 'yeast'      && h(YeastTab),
    tab === 'scaler'     && h(ScalerTab),
    tab === 'pan'        && h(PanTab),
    tab === 'bread'      && h(BreadTab),
  );
}
