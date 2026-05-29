const CATEGORIES = {
  length: {
    label: 'Length',
    units: {
      mm:   { label: 'Millimeters (mm)',     factor: 0.001 },
      cm:   { label: 'Centimeters (cm)',     factor: 0.01 },
      m:    { label: 'Meters (m)',           factor: 1 },
      km:   { label: 'Kilometers (km)',      factor: 1000 },
      in:   { label: 'Inches (in)',          factor: 0.0254 },
      ft:   { label: 'Feet (ft)',            factor: 0.3048 },
      yd:   { label: 'Yards (yd)',           factor: 0.9144 },
      mi:   { label: 'Miles (mi)',           factor: 1609.344 },
      nmi:  { label: 'Nautical Miles (nmi)', factor: 1852 },
    },
    base: 'm',
  },
  weight: {
    label: 'Weight',
    units: {
      mg:  { label: 'Milligrams (mg)',   factor: 0.000001 },
      g:   { label: 'Grams (g)',         factor: 0.001 },
      kg:  { label: 'Kilograms (kg)',    factor: 1 },
      t:   { label: 'Tonnes (t)',        factor: 1000 },
      lb:  { label: 'Pounds (lb)',       factor: 0.453592 },
      oz:  { label: 'Ounces (oz)',       factor: 0.0283495 },
      st:  { label: 'Stone (st)',        factor: 6.35029 },
    },
    base: 'kg',
  },
  temperature: {
    label: 'Temperature',
    units: {
      c: { label: 'Celsius (°C)' },
      f: { label: 'Fahrenheit (°F)' },
      k: { label: 'Kelvin (K)' },
    },
    base: 'c',
  },
  speed: {
    label: 'Speed',
    units: {
      'ms':   { label: 'Meters/sec (m/s)',  factor: 1 },
      'kph':  { label: 'Km/hour (km/h)',    factor: 0.277778 },
      'mph':  { label: 'Miles/hour (mph)',  factor: 0.44704 },
      'knot': { label: 'Knots (kn)',        factor: 0.514444 },
      'mach': { label: 'Mach (M)',          factor: 340.29 },
    },
    base: 'ms',
  },
};

function toBase(value, unit, category) {
  if (category === 'temperature') {
    if (unit === 'c') return value;
    if (unit === 'f') return (value - 32) * 5 / 9;
    if (unit === 'k') return value - 273.15;
  }
  return value * CATEGORIES[category].units[unit].factor;
}

function fromBase(value, unit, category) {
  if (category === 'temperature') {
    if (unit === 'c') return value;
    if (unit === 'f') return value * 9 / 5 + 32;
    if (unit === 'k') return value + 273.15;
  }
  return value / CATEGORIES[category].units[unit].factor;
}

function convert(value, from, to, category) {
  if (isNaN(value)) return '';
  const base = toBase(value, from, category);
  const result = fromBase(base, to, category);
  // Format: trim unnecessary decimals
  return parseFloat(result.toPrecision(10)).toString();
}

function formatFormula(from, to, category) {
  if (category === 'temperature') {
    const formulas = {
      'c-f': 'result = (value × 9/5) + 32',
      'f-c': 'result = (value − 32) × 5/9',
      'c-k': 'result = value + 273.15',
      'k-c': 'result = value − 273.15',
      'f-k': 'result = (value − 32) × 5/9 + 273.15',
      'k-f': 'result = (value − 273.15) × 9/5 + 32',
    };
    return formulas[`${from}-${to}`] || 'same unit';
  }
  const ff = CATEGORIES[category].units[from].factor;
  const tf = CATEGORIES[category].units[to].factor;
  const ratio = ff / tf;
  const pretty = parseFloat(ratio.toPrecision(6));
  return `1 ${from} = ${pretty} ${to}`;
}

const { h, render, Component } = window.preact;
const { useState, useCallback, useEffect, useRef } = window.preactHooks;

export function UnitConverter() {
  const [category, setCategory]   = useState('length');
  const [fromUnit, setFromUnit]   = useState('m');
  const [toUnit, setToUnit]       = useState('km');
  const [fromVal, setFromVal]     = useState('1000');
  const [toVal, setToVal]         = useState('');
  const [lastEdited, setLastEdited] = useState('from');

  // Restore state from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tool_unit') || '{}');
    if (saved.category) {
      setCategory(saved.category);
      const cat = CATEGORIES[saved.category];
      const units = Object.keys(cat.units);
      setFromUnit(saved.fromUnit && cat.units[saved.fromUnit] ? saved.fromUnit : units[0]);
      setToUnit(saved.toUnit && cat.units[saved.toUnit] ? saved.toUnit : units[1]);
      setFromVal(saved.fromVal ?? '1');
    }
  }, []);

  // Recalculate whenever inputs change
  useEffect(() => {
    if (lastEdited === 'from') {
      const val = parseFloat(fromVal);
      setToVal(fromVal === '' ? '' : convert(val, fromUnit, toUnit, category));
    } else {
      const val = parseFloat(toVal);
      setFromVal(toVal === '' ? '' : convert(val, toUnit, fromUnit, category));
    }
    localStorage.setItem('tool_unit', JSON.stringify({ category, fromUnit, toUnit, fromVal }));
  }, [fromVal, toVal, fromUnit, toUnit, category, lastEdited]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    const units = Object.keys(CATEGORIES[cat].units);
    setFromUnit(units[0]);
    setToUnit(units.length > 1 ? units[1] : units[0]);
    setFromVal('1');
    setLastEdited('from');
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromVal(toVal);
    setLastEdited('from');
  };

  const cat = CATEGORIES[category];
  const units = Object.keys(cat.units);
  const formula = (fromUnit !== toUnit) ? formatFormula(fromUnit, toUnit, category) : 'Same unit';
  const quickRefs = units.slice(0, 5).map(u => `1 ${fromUnit} = ${convert(1, fromUnit, u, category)} ${u}`);

  return h('div', { class: 'tool-page' },
    h('div', { class: 'tool-page-header' },
      h('div', { class: 'tool-page-icon', style: 'background: color-mix(in srgb, var(--tint-unit) 15%, transparent)' }, '📐'),
      h('div', null,
        h('div', { class: 'tool-page-title' }, 'Unit Converter'),
        h('div', { class: 'tool-page-subtitle' }, 'Length · Weight · Temperature · Speed'),
      ),
    ),

    // Category tabs
    h('div', { class: 'card', style: 'margin-bottom: var(--space-4)' },
      h('div', { class: 'label' }, 'Category'),
      h('div', { class: 'pill-tabs' },
        Object.entries(CATEGORIES).map(([key, val]) =>
          h('button', {
            key,
            class: `pill-tab ${category === key ? 'active' : ''}`,
            onClick: () => handleCategoryChange(key),
          }, val.label)
        )
      ),
    ),

    // Converter panels
    h('div', { class: 'card', style: 'margin-bottom: var(--space-4)' },
      h('div', { class: 'converter-row' },
        // From panel
        h('div', { class: 'converter-panel' },
          h('input', {
            class: 'converter-value',
            type: 'number',
            placeholder: '0',
            value: fromVal,
            onInput: (e) => { setFromVal(e.target.value); setLastEdited('from'); },
          }),
          h('select', {
            class: 'select converter-unit-select',
            value: fromUnit,
            onChange: (e) => { setFromUnit(e.target.value); setLastEdited('from'); },
          },
            units.map(u => h('option', { key: u, value: u }, cat.units[u].label))
          ),
        ),

        // Swap
        h('button', { class: 'swap-btn', onClick: swap, title: 'Swap units' }, '⇄'),

        // To panel
        h('div', { class: 'converter-panel' },
          h('input', {
            class: 'converter-value',
            type: 'number',
            placeholder: '0',
            value: toVal,
            onInput: (e) => { setToVal(e.target.value); setLastEdited('to'); },
          }),
          h('select', {
            class: 'select converter-unit-select',
            value: toUnit,
            onChange: (e) => { setToUnit(e.target.value); setLastEdited('from'); },
          },
            units.map(u => h('option', { key: u, value: u }, cat.units[u].label))
          ),
        ),
      ),
    ),

    // Formula
    h('div', { class: 'info-box', style: 'margin-bottom: var(--space-4)' },
      h('span', null, 'ƒ'),
      h('span', null, formula),
    ),

    // Quick reference
    h('div', { class: 'card' },
      h('div', { class: 'label', style: 'margin-bottom: var(--space-3)' }, 'Quick Reference'),
      h('div', { style: 'display: flex; flex-wrap: wrap; gap: var(--space-2)' },
        quickRefs.filter(r => !r.includes('Infinity') && !r.includes('NaN')).map((ref, i) =>
          h('span', { key: i, class: 'badge' }, ref)
        )
      ),
    ),
  );
}
