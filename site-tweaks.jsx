/* Bailamos site — Tweaks island.
   The page is static HTML; this panel just drives [data-direction] and a few
   CSS variables / copy slots on the live document. */
const { useEffect } = React;

const DIRECTIONS = { 'Warm': 'editorial', 'Nightlife': 'nightlife', 'Clean': 'clean' };

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "Clean",
  "accent": "#D8623C",
  "headline": "",
  "lede": "",
  "float": true
}/*EDITMODE-END*/;

function setVar(name, val) { document.documentElement.style.setProperty(name, val); }

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.setAttribute('data-direction', DIRECTIONS[t.direction] || 'editorial');
  }, [t.direction]);

  useEffect(() => {
    const c = t.accent;
    setVar('--accent', c);
    setVar('--accent-deep', c);
    setVar('--accent-soft', `color-mix(in srgb, ${c} 18%, transparent)`);
  }, [t.accent]);

  useEffect(() => {
    const el = document.getElementById('heroHeadline');
    if (el && t.headline && t.headline.trim()) el.textContent = t.headline;
  }, [t.headline]);

  useEffect(() => {
    const el = document.getElementById('heroLede');
    if (el && t.lede && t.lede.trim()) el.textContent = t.lede;
  }, [t.lede]);

  useEffect(() => {
    document.querySelectorAll('.phone-float').forEach(el => {
      el.style.animationPlayState = t.float ? 'running' : 'paused';
    });
  }, [t.float]);

  return (
    <TweaksPanel>
      <TweakSection label="Direction" />
      <TweakRadio
        label="Visual mood"
        value={t.direction}
        options={['Warm', 'Nightlife', 'Clean']}
        onChange={(v) => setTweak('direction', v)} />
      <TweakColor
        label="Accent"
        value={t.accent}
        options={['#D8623C', '#5E1B25', '#BC8636', '#5F7A66']}
        onChange={(v) => setTweak('accent', v)} />

      <TweakSection label="Hero copy" />
      <TweakText
        label="Headline"
        value={t.headline}
        placeholder="Find your floor, anywhere you are."
        onChange={(v) => setTweak('headline', v)} />
      <TweakText
        label="Sub-headline"
        value={t.lede}
        placeholder="Every social on one live map…"
        onChange={(v) => setTweak('lede', v)} />

      <TweakSection label="Motion" />
      <TweakToggle
        label="Float the phone"
        value={t.float}
        onChange={(v) => setTweak('float', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<App />);
