const { h } = window.preact;
const { useState, useRef, useCallback, useEffect } = window.preactHooks;

const PRESETS = [
  { label: 'Instagram Square',   w: 1080, h: 1080 },
  { label: 'Instagram Story',    w: 1080, h: 1920 },
  { label: 'Twitter/X Banner',   w: 1500, h: 500  },
  { label: 'OG / Facebook Link', w: 1200, h: 630  },
  { label: 'YouTube Thumbnail',  w: 1280, h: 720  },
  { label: 'Full HD',            w: 1920, h: 1080 },
  { label: '4K UHD',             w: 3840, h: 2160 },
];

const FORMATS = ['JPEG', 'PNG', 'WebP'];

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/1048576).toFixed(2)} MB`;
}

export function ImageResizer() {
  const [src, setSrc]           = useState(null);
  const [origSize, setOrigSize] = useState(null);
  const [origW, setOrigW]       = useState(0);
  const [origH, setOrigH]       = useState(0);
  const [width, setWidth]       = useState('');
  const [height, setHeight]     = useState('');
  const [locked, setLocked]     = useState(true);
  const [format, setFormat]     = useState('JPEG');
  const [quality, setQuality]   = useState(85);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview]   = useState(null);
  const [outSize, setOutSize]   = useState(null);
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef(null);
  const imgRef  = useRef(new Image());

  const loadFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setOrigSize(file.size);
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.onload = () => {
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
      imgRef.current = img;
    };
    img.src = url;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    loadFile(e.dataTransfer.files[0]);
  };

  const handleWidthChange = (v) => {
    setWidth(v);
    if (locked && origW && origH && v) {
      setHeight(String(Math.round(origH * (Number(v) / origW))));
    }
  };

  const handleHeightChange = (v) => {
    setHeight(v);
    if (locked && origW && origH && v) {
      setWidth(String(Math.round(origW * (Number(v) / origH))));
    }
  };

  const applyPreset = (preset) => {
    let w = preset.w;
    let h = preset.h;

    if (origW && origH) {
      const srcRatio    = origW / origH;
      const presetRatio = preset.w / preset.h;
      if (srcRatio > presetRatio) {
        w = preset.w;
        h = Math.round(preset.w / srcRatio);
      } else {
        h = preset.h;
        w = Math.round(preset.h * srcRatio);
      }
    }

    setWidth(String(w));
    setHeight(String(h));
    setLocked(true);

    // Auto-adjust quality based on whether we're upscaling or downscaling
    const isUpscaling = w > (origW || 0) || h > (origH || 0);
    if (isUpscaling) {
      setQuality(100); // max quality for upscaling
    } else {
      // Scale quality with output size relative to original: bigger output = higher quality
      const scale = Math.max(w / (origW || w), h / (origH || h));
      const q = Math.round(70 + scale * 25); // range: 70–95
      setQuality(Math.min(95, Math.max(70, q)));
    }
  };

  const doResize = useCallback(() => {
    if (!imgRef.current.src) return;
    setProcessing(true);
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      canvas.width  = Number(width)  || origW;
      canvas.height = Number(height) || origH;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
      const mime = format === 'PNG' ? 'image/png' : format === 'WebP' ? 'image/webp' : 'image/jpeg';
      const q    = format === 'PNG' ? 1 : quality / 100;
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setPreview(url);
        setOutSize(blob.size);
        setProcessing(false);
      }, mime, q);
    }, 50);
  }, [imgRef, width, height, format, quality, origW, origH]);

  const download = () => {
    if (!preview) return;
    const a = document.createElement('a');
    a.href = preview;
    a.download = `resized-${width}x${height}.${format.toLowerCase()}`;
    a.click();
  };

  return h('div', { class: 'tool-page' },
    h('div', { class: 'tool-page-header' },
      h('div', { class: 'tool-page-icon', style: 'background: color-mix(in srgb, var(--tint-image) 15%, transparent)' }, '🖼️'),
      h('div', null,
        h('div', { class: 'tool-page-title' }, 'Image Resizer'),
        h('div', { class: 'tool-page-subtitle' }, 'Resize & convert — all in your browser'),
      ),
    ),

    // Drop zone
    !src && h('div', {
      class: `drop-zone ${dragOver ? 'drag-over' : ''}`,
      style: 'margin-bottom: var(--space-4)',
      onDragOver: (e) => { e.preventDefault(); setDragOver(true); },
      onDragLeave: () => setDragOver(false),
      onDrop: handleDrop,
      onClick: () => fileRef.current?.click(),
    },
      h('div', { class: 'drop-zone-icon' }, '🖼️'),
      h('div', { class: 'drop-zone-text' }, 'Drop image here or click to choose'),
      h('div', { class: 'drop-zone-sub' }, 'JPEG, PNG, WebP, GIF, BMP supported'),
      h('input', { ref: fileRef, type: 'file', accept: 'image/*', style: 'display:none',
        onChange: (e) => loadFile(e.target.files[0]) }),
    ),

    src && h('div', null,
      // Image info bar
      h('div', { style: 'display:flex; align-items:center; gap: var(--space-3); margin-bottom: var(--space-4); flex-wrap: wrap' },
        h('span', { class: 'badge' }, `Original: ${origW}×${origH}px`),
        h('span', { class: 'badge' }, formatBytes(origSize)),
        h('button', {
          class: 'btn btn-ghost',
          style: 'padding: 4px 12px; height: 32px; font-size: var(--text-sm)',
          onClick: () => { setSrc(null); setPreview(null); setOutSize(null); },
        }, '× Change image'),
      ),

      // Dimensions card
      h('div', { class: 'card', style: 'margin-bottom: var(--space-4)' },
        h('div', { class: 'label', style: 'margin-bottom: var(--space-3)' }, 'Dimensions'),
        h('div', { style: 'display: grid; grid-template-columns: 1fr auto 1fr; gap: var(--space-3); align-items: end' },
          h('div', { class: 'field', style: 'margin:0' },
            h('label', { class: 'label' }, 'Width (px)'),
            h('input', { class: 'input', style: 'height:44px; font-size: var(--text-md)', type: 'number', value: width,
              onInput: (e) => handleWidthChange(e.target.value) }),
          ),
          h('div', {
            style: 'display:flex; align-items:center; justify-content:center; padding-bottom: 2px',
            title: locked ? 'Unlock aspect ratio' : 'Lock aspect ratio',
          },
            h('button', {
              class: 'btn btn-icon',
              style: `font-size:18px; background: ${locked ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : 'var(--bg-tertiary)'}`,
              onClick: () => setLocked(!locked),
            }, locked ? '🔒' : '🔓'),
          ),
          h('div', { class: 'field', style: 'margin:0' },
            h('label', { class: 'label' }, 'Height (px)'),
            h('input', { class: 'input', style: 'height:44px; font-size: var(--text-md)', type: 'number', value: height,
              onInput: (e) => handleHeightChange(e.target.value) }),
          ),
        ),

        h('div', { class: 'divider' }),
        h('div', { class: 'label', style: 'margin-bottom: var(--space-2)' }, 'Presets'),
        h('div', { class: 'chip-group' },
          PRESETS.map(p =>
            h('button', { key: p.label, class: 'chip', onClick: () => applyPreset(p) }, p.label)
          )
        ),
      ),

      // Format & quality card
      h('div', { class: 'card', style: 'margin-bottom: var(--space-4)' },
        h('div', { style: 'display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4)' },
          h('div', { class: 'field', style: 'margin:0' },
            h('label', { class: 'label' }, 'Output format'),
            h('select', { class: 'select', style: 'width:100%', value: format,
              onChange: (e) => setFormat(e.target.value) },
              FORMATS.map(f => h('option', { key: f, value: f }, f))
            ),
          ),
          format !== 'PNG' && h('div', { class: 'field', style: 'margin:0' },
            h('label', { class: 'label' }, `Quality: ${quality}%`),
            h('input', { type: 'range', min: 10, max: 100, value: quality, style: 'width:100%; margin-top: 10px',
              onInput: (e) => setQuality(Number(e.target.value)) }),
          ),
        ),
      ),

      // Action
      h('div', { style: 'display:flex; gap: var(--space-3); margin-bottom: var(--space-4); flex-wrap: wrap' },
        h('button', {
          class: 'btn btn-primary',
          style: 'flex: 1; min-width: 120px',
          onClick: doResize,
          disabled: processing,
        }, processing ? h('span', { class: 'spinner', style: 'border-top-color: white; width:18px;height:18px;border-width:2px' }) : '↓ Resize'),
        preview && h('button', { class: 'btn btn-secondary', style: 'flex: 1; min-width: 120px', onClick: download }, '⬇ Download'),
      ),

      // Preview
      preview && h('div', { class: 'card' },
        h('div', { style: 'display:flex; justify-content:space-between; align-items:center; margin-bottom: var(--space-3)' },
          h('div', { class: 'label', style: 'margin:0' }, 'Preview'),
          h('div', { style: 'display:flex; gap: var(--space-2)' },
            h('span', { class: 'badge' }, `${width}×${height}px`),
            outSize && h('span', { class: 'badge accent' }, formatBytes(outSize)),
          ),
        ),
        h('img', { src: preview, style: 'max-width:100%; border-radius: var(--radius-md); display:block', alt: 'Preview' }),
      ),

      // Privacy badge
      h('div', { class: 'info-box', style: 'margin-top: var(--space-4)' },
        h('span', null, '🔒'),
        h('span', null, 'All processing happens in your browser. Your image is never uploaded to any server.'),
      ),
    ),
  );
}
