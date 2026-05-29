/**
 * Sketch Art illustrations for each tool card.
 * SVGs use currentColor strokes — the parent container sets
 *   color: var(--card-tint)
 * so each sketch picks up the tool's tint automatically.
 *
 * To add a sketch for a new tool:
 *   SKETCHES['your-tool-slug'] = `<svg …>…</svg>`;
 */

const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const SKETCHES = {

  /* ── Unit Converter ─ Ruler + Balance Scale ──────────────────── */
  'unit-converter': svg(`
    <rect x="12" y="42" width="196" height="34" rx="4" stroke-width="2"/>
    <line x1="42"  y1="42" x2="42"  y2="58" stroke-width="1.6"/>
    <line x1="82"  y1="42" x2="82"  y2="58" stroke-width="1.6"/>
    <line x1="122" y1="42" x2="122" y2="58" stroke-width="1.6"/>
    <line x1="162" y1="42" x2="162" y2="58" stroke-width="1.6"/>
    <line x1="202" y1="42" x2="202" y2="58" stroke-width="1.6"/>
    <line x1="22"  y1="42" x2="22"  y2="51" stroke-width="1"/>
    <line x1="32"  y1="42" x2="32"  y2="51" stroke-width="1"/>
    <line x1="52"  y1="42" x2="52"  y2="51" stroke-width="1"/>
    <line x1="62"  y1="42" x2="62"  y2="51" stroke-width="1"/>
    <line x1="72"  y1="42" x2="72"  y2="51" stroke-width="1"/>
    <line x1="92"  y1="42" x2="92"  y2="51" stroke-width="1"/>
    <line x1="102" y1="42" x2="102" y2="51" stroke-width="1"/>
    <line x1="112" y1="42" x2="112" y2="51" stroke-width="1"/>
    <line x1="132" y1="42" x2="132" y2="51" stroke-width="1"/>
    <line x1="142" y1="42" x2="142" y2="51" stroke-width="1"/>
    <line x1="152" y1="42" x2="152" y2="51" stroke-width="1"/>
    <line x1="172" y1="42" x2="172" y2="51" stroke-width="1"/>
    <line x1="182" y1="42" x2="182" y2="51" stroke-width="1"/>
    <line x1="192" y1="42" x2="192" y2="51" stroke-width="1"/>
    <text x="39"  y="70" font-size="8" fill="currentColor" stroke="none" font-family="monospace">1</text>
    <text x="79"  y="70" font-size="8" fill="currentColor" stroke="none" font-family="monospace">2</text>
    <text x="119" y="70" font-size="8" fill="currentColor" stroke="none" font-family="monospace">3</text>
    <text x="159" y="70" font-size="8" fill="currentColor" stroke="none" font-family="monospace">4</text>
    <text x="199" y="70" font-size="8" fill="currentColor" stroke="none" font-family="monospace">5</text>
    <line x1="13"  y1="47" x2="22" y2="68" stroke-width="0.8" opacity="0.45"/>
    <line x1="18"  y1="42" x2="28" y2="66" stroke-width="0.8" opacity="0.45"/>
    <line x1="196" y1="45" x2="206" y2="65" stroke-width="0.8" opacity="0.45"/>
    <line x1="201" y1="42" x2="208" y2="56" stroke-width="0.8" opacity="0.45"/>
    <line x1="110" y1="96" x2="110" y2="162" stroke-width="2.2"/>
    <line x1="58"  y1="96" x2="162" y2="96" stroke-width="2"/>
    <circle cx="110" cy="96" r="4" stroke-width="1.5"/>
    <line x1="67"  y1="96" x2="48"  y2="117" stroke-width="1.2"/>
    <line x1="75"  y1="96" x2="48"  y2="117" stroke-width="1.2"/>
    <line x1="82"  y1="96" x2="48"  y2="117" stroke-width="1.2"/>
    <path d="M32 117 C34 126 48 131 64 126 C70 124 74 120 76 117" stroke-width="1.6"/>
    <line x1="138" y1="96" x2="172" y2="119" stroke-width="1.2"/>
    <line x1="146" y1="96" x2="172" y2="119" stroke-width="1.2"/>
    <line x1="153" y1="96" x2="172" y2="119" stroke-width="1.2"/>
    <path d="M156 119 C158 128 172 133 188 128 C194 126 198 122 200 119" stroke-width="1.6"/>
    <rect x="165" y="109" width="12" height="9" rx="2" stroke-width="1.3"/>
    <line x1="88"  y1="162" x2="132" y2="162" stroke-width="2"/>
    <line x1="88"  y1="162" x2="83"  y2="170" stroke-width="1.8"/>
    <line x1="132" y1="162" x2="137" y2="170" stroke-width="1.8"/>
    <line x1="37"  y1="119" x2="43" y2="127" stroke-width="0.7" opacity="0.55"/>
    <line x1="43"  y1="118" x2="50" y2="126" stroke-width="0.7" opacity="0.55"/>
    <line x1="49"  y1="117" x2="56" y2="125" stroke-width="0.7" opacity="0.55"/>
  `),

  /* ── Currency Converter ─ Stacked Coins + Banknote ───────────── */
  'currency-converter': svg(`
    <ellipse cx="119" cy="76" rx="48" ry="15" stroke-width="1.3" opacity="0.45"/>
    <ellipse cx="115" cy="68" rx="48" ry="15" stroke-width="1.5"/>
    <path d="M67 68 L67 80 C67 87 88 92 115 92 C142 92 163 87 163 80 L163 68" stroke-width="1.5"/>
    <ellipse cx="112" cy="60" rx="48" ry="15" stroke-width="2"/>
    <path d="M64 60 L64 72 C64 79 85 84 112 84 C139 84 160 79 160 72 L160 60" stroke-width="2"/>
    <path d="M107 52 C107 52 108 51 112 51 C116 51 118 53 118 55 C118 58 116 59 112 60 C108 61 106 63 106 65 C106 67 108 69 112 69 C116 69 117 68 118 68" stroke-width="1.6"/>
    <line x1="112" y1="49" x2="112" y2="71" stroke-width="1.3"/>
    <line x1="69"  y1="62" x2="72" y2="71" stroke-width="0.8" opacity="0.5"/>
    <line x1="74"  y1="61" x2="77" y2="70" stroke-width="0.8" opacity="0.5"/>
    <line x1="151" y1="61" x2="154" y2="70" stroke-width="0.8" opacity="0.5"/>
    <line x1="156" y1="62" x2="159" y2="70" stroke-width="0.8" opacity="0.5"/>
    <rect x="25"  y="100" width="92" height="54" rx="5" stroke-width="1.8"/>
    <rect x="31"  y="106" width="80" height="42" rx="3" stroke-width="1"/>
    <line x1="52"  y1="116" x2="101" y2="116" stroke-width="0.9"/>
    <line x1="52"  y1="124" x2="96"  y2="124" stroke-width="0.9"/>
    <line x1="52"  y1="132" x2="99"  y2="132" stroke-width="0.9"/>
    <line x1="52"  y1="140" x2="93"  y2="140" stroke-width="0.9"/>
    <path d="M36 130 C36 120 42 112 50 112 C58 112 64 120 64 130 C64 140 58 148 50 148" stroke-width="1.6"/>
    <line x1="33" y1="126" x2="62" y2="126" stroke-width="1.2"/>
    <line x1="33" y1="134" x2="60" y2="134" stroke-width="1.2"/>
    <path d="M153 108 C163 101 174 97 177 105 C180 113 171 117 159 113" stroke-width="1.7"/>
    <polyline points="149,106 154,107 152,112" stroke-width="1.4"/>
    <path d="M153 132 C163 139 174 143 177 135 C180 127 171 123 159 127" stroke-width="1.7"/>
    <polyline points="149,134 154,133 152,137" stroke-width="1.4"/>
    <text x="160" y="122" font-size="10" fill="currentColor" stroke="none" font-family="monospace" opacity="0.5">¥</text>
  `),

  /* ── Image Resizer ─ Camera + Lens Landscape ─────────────────── */
  'image-resizer': svg(`
    <rect x="28" y="52" width="164" height="112" rx="14" stroke-width="2"/>
    <rect x="74" y="42" width="52" height="16" rx="7" stroke-width="1.8"/>
    <circle cx="140" cy="50" r="7" stroke-width="1.5"/>
    <circle cx="140" cy="50" r="4" stroke-width="1"/>
    <rect x="35" y="56" width="18" height="12" rx="3" stroke-width="1.3"/>
    <circle cx="110" cy="116" r="42" stroke-width="2"/>
    <circle cx="110" cy="116" r="34" stroke-width="1.3"/>
    <circle cx="110" cy="116" r="24" stroke-width="1.8"/>
    <path d="M86 134 L96 112 L107 128 L116 108 L132 134" stroke-width="1.3"/>
    <circle cx="90" cy="117" r="7" stroke-width="1.3"/>
    <line x1="86" y1="134" x2="134" y2="134" stroke-width="0.9" opacity="0.6"/>
    <line x1="95" y1="116" x2="106" y2="116" stroke-width="0.7" opacity="0.5"/>
    <line x1="115" y1="116" x2="126" y2="116" stroke-width="0.7" opacity="0.5"/>
    <line x1="30"  y1="56" x2="44"  y2="72" stroke-width="0.8" opacity="0.45"/>
    <line x1="36"  y1="52" x2="50"  y2="70" stroke-width="0.8" opacity="0.45"/>
    <line x1="177" y1="56" x2="188" y2="70" stroke-width="0.8" opacity="0.45"/>
    <line x1="183" y1="52" x2="190" y2="64" stroke-width="0.8" opacity="0.45"/>
    <polyline points="18,38 18,24 32,24" stroke-width="1.8"/>
    <line x1="18" y1="24" x2="36" y2="42" stroke-width="1.2" stroke-dasharray="3,2"/>
    <polyline points="202,38 202,24 188,24" stroke-width="1.8"/>
    <line x1="202" y1="24" x2="184" y2="42" stroke-width="1.2" stroke-dasharray="3,2"/>
    <polyline points="18,148 18,162 32,162" stroke-width="1.8"/>
    <line x1="18" y1="162" x2="36" y2="144" stroke-width="1.2" stroke-dasharray="3,2"/>
    <polyline points="202,148 202,162 188,162" stroke-width="1.8"/>
    <line x1="202" y1="162" x2="184" y2="144" stroke-width="1.2" stroke-dasharray="3,2"/>
  `),

  /* ── Color Picker ─ Artist Palette + Brush ───────────────────── */
  'color-picker': svg(`
    <path d="M62 142 C30 136 18 114 23 92 C28 70 50 56 74 58 C84 59 90 67 92 76 C94 84 96 88 102 88 C120 88 138 85 152 76 C166 67 178 72 183 88 C188 104 180 126 163 137 C146 148 128 150 110 147 C92 144 80 148 62 142 Z" stroke-width="2"/>
    <circle cx="90" cy="108" r="14" stroke-width="1.8"/>
    <line x1="25"  y1="96"  x2="36" y2="112" stroke-width="0.8" opacity="0.45"/>
    <line x1="30"  y1="91"  x2="42" y2="109" stroke-width="0.8" opacity="0.45"/>
    <line x1="160" y1="126" x2="173" y2="140" stroke-width="0.8" opacity="0.45"/>
    <line x1="166" y1="122" x2="178" y2="134" stroke-width="0.8" opacity="0.45"/>
    <circle cx="118" cy="70" r="10" stroke-width="1.5"/>
    <circle cx="142" cy="82" r="10" stroke-width="1.5"/>
    <circle cx="160" cy="100" r="10" stroke-width="1.5"/>
    <circle cx="156" cy="124" r="10" stroke-width="1.5"/>
    <circle cx="132" cy="140" r="10" stroke-width="1.5"/>
    <line x1="111" y1="65" x2="118" y2="73" stroke-width="0.8" opacity="0.6"/>
    <line x1="114" y1="62" x2="122" y2="70" stroke-width="0.8" opacity="0.6"/>
    <line x1="136" y1="77" x2="143" y2="85" stroke-width="0.8" opacity="0.6"/>
    <line x1="153" y1="95" x2="160" y2="103" stroke-width="0.8" opacity="0.6"/>
    <line x1="32"  y1="26" x2="124" y2="106" stroke-width="3.2"/>
    <rect x="22"   y="16" width="14" height="18" rx="2" stroke-width="1.5" transform="rotate(-42 29 25)"/>
    <path d="M13 12 C15 9 18 8 20 10 C22 13 23 17 20 22 C18 20 13 16 13 12 Z" stroke-width="1.3"/>
    <line x1="128" y1="109" x2="204" y2="174" stroke-width="2.8"/>
    <line x1="124" y1="107" x2="135" y2="114" stroke-width="4.5" opacity="0.45"/>
    <path d="M185 22 A30 30 0 0 1 215 52" stroke-width="2.5" opacity="0.8"/>
    <path d="M181 24 A30 30 0 0 1 212 54" stroke-width="1"   opacity="0.4"/>
    <path d="M177 27 A30 30 0 0 1 208 57" stroke-width="0.7" opacity="0.3"/>
    <path d="M52 58 C52 52 56 48 61 48 C66 48 70 52 70 58 C70 66 61 72 61 72 C61 72 52 66 52 58 Z" stroke-width="1.5"/>
  `),

  /* ── Baker's Tool ─ Artisan Bread + Rolling Pin + Wheat ──────── */
  'bakers-tool': svg(`
    <ellipse cx="110" cy="112" rx="74" ry="52" stroke-width="2.2"/>
    <path d="M78 86  C92 94  128 94  142 86"  stroke-width="1.6"/>
    <path d="M74 100 C90 109 130 109 146 100" stroke-width="1.2" opacity="0.65"/>
    <path d="M110 72 C112 88 112 130 110 148" stroke-width="1.6"/>
    <path d="M110 77 C121 84 140 100 142 120"  stroke-width="1"   opacity="0.55"/>
    <path d="M110 77 C99  84 80  100 78  120"  stroke-width="1"   opacity="0.55"/>
    <line x1="88"  y1="76" x2="95"  y2="90" stroke-width="0.9" opacity="0.55"/>
    <line x1="96"  y1="73" x2="103" y2="88" stroke-width="0.9" opacity="0.55"/>
    <line x1="118" y1="73" x2="125" y2="88" stroke-width="0.9" opacity="0.55"/>
    <line x1="126" y1="76" x2="132" y2="90" stroke-width="0.9" opacity="0.55"/>
    <rect x="20"  y="152" width="180" height="17" rx="8.5" stroke-width="1.9"/>
    <rect x="8"   y="155" width="15"  height="11" rx="5.5" stroke-width="1.5"/>
    <rect x="197" y="155" width="15"  height="11" rx="5.5" stroke-width="1.5"/>
    <line x1="55"  y1="152" x2="55"  y2="169" stroke-width="1"   opacity="0.55"/>
    <line x1="85"  y1="152" x2="85"  y2="169" stroke-width="1"   opacity="0.55"/>
    <line x1="110" y1="152" x2="110" y2="169" stroke-width="1"   opacity="0.55"/>
    <line x1="135" y1="152" x2="135" y2="169" stroke-width="1"   opacity="0.55"/>
    <line x1="165" y1="152" x2="165" y2="169" stroke-width="1"   opacity="0.55"/>
    <path d="M30 44 C30 58 32 72 30 86 C30 96 24 102 24 112"  stroke-width="1.6"/>
    <ellipse cx="21" cy="46" rx="5.5" ry="10" stroke-width="1.3" transform="rotate(-18 21 46)"/>
    <ellipse cx="32" cy="40" rx="5.5" ry="10" stroke-width="1.3" transform="rotate(16 32 40)"/>
    <ellipse cx="26" cy="28" rx="5.5" ry="10" stroke-width="1.3"/>
    <line x1="26"  y1="38" x2="26"  y2="44" stroke-width="1"/>
    <line x1="21"  y1="56" x2="25"  y2="58" stroke-width="0.9" opacity="0.5"/>
    <line x1="28"  y1="52" x2="32"  y2="56" stroke-width="0.9" opacity="0.5"/>
    <path d="M190 44 C190 58 188 72 190 86 C190 96 196 102 196 112" stroke-width="1.6"/>
    <ellipse cx="199" cy="46" rx="5.5" ry="10" stroke-width="1.3" transform="rotate(18 199 46)"/>
    <ellipse cx="188" cy="40" rx="5.5" ry="10" stroke-width="1.3" transform="rotate(-16 188 40)"/>
    <ellipse cx="194" cy="28" rx="5.5" ry="10" stroke-width="1.3"/>
    <line x1="194" y1="38" x2="194" y2="44" stroke-width="1"/>
    <circle cx="56"  cy="98" r="2"   fill="currentColor" stroke="none" opacity="0.4"/>
    <circle cx="166" cy="96" r="2"   fill="currentColor" stroke="none" opacity="0.4"/>
    <circle cx="62"  cy="90" r="1.5" fill="currentColor" stroke="none" opacity="0.4"/>
    <circle cx="170" cy="88" r="1.5" fill="currentColor" stroke="none" opacity="0.4"/>
    <circle cx="42"  cy="108" r="1.5" fill="currentColor" stroke="none" opacity="0.35"/>
    <circle cx="178" cy="106" r="1.5" fill="currentColor" stroke="none" opacity="0.35"/>
  `),
};
