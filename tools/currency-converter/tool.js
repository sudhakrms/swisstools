const { h } = window.preact;
const { useState, useEffect, useCallback, useRef } = window.preactHooks;

const CURRENCIES = [
  'USD','EUR','GBP','INR','JPY','CAD','AUD','CHF','CNY','HKD',
  'SGD','SEK','NOK','DKK','MXN','BRL','ZAR','KRW','IDR','TRY',
  'SAR','AED','NZD','THB','MYR','PHP','EGP','PKR','BDT','NGN',
];

const CURRENCY_NAMES = {
  USD:'US Dollar', EUR:'Euro', GBP:'British Pound', INR:'Indian Rupee',
  JPY:'Japanese Yen', CAD:'Canadian Dollar', AUD:'Australian Dollar',
  CHF:'Swiss Franc', CNY:'Chinese Yuan', HKD:'Hong Kong Dollar',
  SGD:'Singapore Dollar', SEK:'Swedish Krona', NOK:'Norwegian Krone',
  DKK:'Danish Krone', MXN:'Mexican Peso', BRL:'Brazilian Real',
  ZAR:'South African Rand', KRW:'South Korean Won', IDR:'Indonesian Rupiah',
  TRY:'Turkish Lira', SAR:'Saudi Riyal', AED:'UAE Dirham',
  NZD:'New Zealand Dollar', THB:'Thai Baht', MYR:'Malaysian Ringgit',
  PHP:'Philippine Peso', EGP:'Egyptian Pound', PKR:'Pakistani Rupee',
  BDT:'Bangladeshi Taka', NGN:'Nigerian Naira',
};

const LS_RATES   = 'tool_currency_rates';
const LS_UPDATED = 'tool_currency_updated';
const LS_STATE   = 'tool_currency_state';
const API_URL    = 'https://open.er-api.com/v6/latest/USD';

export function CurrencyConverter() {
  const [rates, setRates]         = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [fromCur, setFromCur]     = useState('USD');
  const [toCur, setToCur]         = useState('INR');
  const [fromVal, setFromVal]     = useState('1');
  const [toVal, setToVal]         = useState('');
  const [lastEdited, setLastEdited] = useState('from');

  // Load cached rates + state
  useEffect(() => {
    const cachedRates = localStorage.getItem(LS_RATES);
    const cachedTime  = localStorage.getItem(LS_UPDATED);
    const savedState  = JSON.parse(localStorage.getItem(LS_STATE) || '{}');

    if (savedState.fromCur) setFromCur(savedState.fromCur);
    if (savedState.toCur)   setToCur(savedState.toCur);
    if (savedState.fromVal) setFromVal(savedState.fromVal);

    const stale = !cachedTime || (Date.now() - Number(cachedTime)) > 3600_000; // 1 hour

    if (cachedRates && !stale) {
      setRates(JSON.parse(cachedRates));
      setUpdatedAt(new Date(Number(cachedTime)));
    } else {
      fetchRates();
    }
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch rates');
      const data = await res.json();
      const r    = data.rates;
      localStorage.setItem(LS_RATES, JSON.stringify(r));
      localStorage.setItem(LS_UPDATED, String(Date.now()));
      setRates(r);
      setUpdatedAt(new Date());
    } catch (e) {
      const cached = localStorage.getItem(LS_RATES);
      if (cached) {
        setRates(JSON.parse(cached));
        setError('Using cached rates — could not reach exchange rate API');
      } else {
        setError('Could not load exchange rates. Check your internet connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const doConvert = useCallback((val, from, to, dir) => {
    if (!rates || val === '' || isNaN(Number(val))) return '';
    const fromRate = rates[from] ?? 1;
    const toRate   = rates[to]   ?? 1;
    const inUSD = dir === 'from' ? Number(val) / fromRate : Number(val) / toRate;
    const result = dir === 'from' ? inUSD * toRate : inUSD * fromRate;
    return parseFloat(result.toPrecision(8)).toString();
  }, [rates]);

  useEffect(() => {
    if (!rates) return;
    if (lastEdited === 'from') {
      setToVal(doConvert(fromVal, fromCur, toCur, 'from'));
    } else {
      setFromVal(doConvert(toVal, toCur, fromCur, 'to'));
    }
    localStorage.setItem(LS_STATE, JSON.stringify({ fromCur, toCur, fromVal }));
  }, [fromVal, toVal, fromCur, toCur, rates, lastEdited]);

  const swap = () => {
    setFromCur(toCur);
    setToCur(fromCur);
    setFromVal(toVal);
    setLastEdited('from');
  };

  const rate = rates ? parseFloat((rates[toCur] / rates[fromCur]).toPrecision(6)) : null;

  return h('div', { class: 'tool-page' },
    h('div', { class: 'tool-page-header' },
      h('div', { class: 'tool-page-icon', style: 'background: color-mix(in srgb, var(--tint-currency) 15%, transparent)' }, '💱'),
      h('div', null,
        h('div', { class: 'tool-page-title' }, 'Currency Converter'),
        h('div', { class: 'tool-page-subtitle' }, '30+ currencies · Live exchange rates'),
      ),
    ),

    // Status bar
    h('div', { style: 'display:flex; align-items:center; gap: var(--space-3); margin-bottom: var(--space-4); flex-wrap: wrap' },
      loading && h('span', { class: 'spinner' }),
      updatedAt && !loading && h('span', { class: 'badge' }, `✓ Rates updated ${updatedAt.toLocaleTimeString()}`),
      h('button', {
        class: 'btn btn-ghost',
        style: 'padding: 4px 12px; height: 32px; font-size: var(--text-sm)',
        onClick: fetchRates,
        disabled: loading,
      }, loading ? 'Refreshing...' : '↻ Refresh'),
    ),

    error && h('div', { class: 'info-box orange', style: 'margin-bottom: var(--space-4)' },
      h('span', null, '⚠️'),
      h('span', null, error),
    ),

    // Converter panels
    h('div', { class: 'card', style: 'margin-bottom: var(--space-4)' },
      h('div', { class: 'converter-row' },
        // From
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
            value: fromCur,
            onChange: (e) => { setFromCur(e.target.value); setLastEdited('from'); },
          },
            CURRENCIES.map(c => h('option', { key: c, value: c }, `${c} — ${CURRENCY_NAMES[c]}`))
          ),
        ),

        h('button', { class: 'swap-btn', onClick: swap, title: 'Swap currencies' }, '⇄'),

        // To
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
            value: toCur,
            onChange: (e) => { setToCur(e.target.value); setLastEdited('from'); },
          },
            CURRENCIES.map(c => h('option', { key: c, value: c }, `${c} — ${CURRENCY_NAMES[c]}`))
          ),
        ),
      ),
    ),

    // Rate display
    rates && h('div', { class: 'info-box green', style: 'margin-bottom: var(--space-4)' },
      h('span', null, '💹'),
      h('span', null, `1 ${fromCur} = ${rate} ${toCur}`),
    ),

    // Popular pairs
    h('div', { class: 'card' },
      h('div', { class: 'label', style: 'margin-bottom: var(--space-3)' }, 'Popular Pairs'),
      h('div', { class: 'chip-group' },
        [['USD','EUR'],['USD','INR'],['USD','GBP'],['EUR','INR'],['GBP','USD'],['USD','JPY']].map(([a,b]) =>
          h('button', {
            key: `${a}-${b}`,
            class: `chip ${fromCur===a && toCur===b ? 'active' : ''}`,
            onClick: () => { setFromCur(a); setToCur(b); setLastEdited('from'); },
          }, `${a} → ${b}`)
        )
      ),
    ),
  );
}
