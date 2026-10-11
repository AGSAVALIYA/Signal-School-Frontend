// @font-face rules for every look. Declaring them costs ~3 KB; the browser downloads a font file only when text on
// screen uses it, so a school only ever fetches its own look's fonts (cached by the service worker after that).
// Latin, Devanagari and Gujarati subsets only.
import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-700.css';
import '@fontsource/noto-sans/latin-ext-400.css';
import '@fontsource/noto-sans/latin-ext-700.css';
import '@fontsource/noto-sans-devanagari/devanagari-400.css';
import '@fontsource/noto-sans-devanagari/devanagari-700.css';
import '@fontsource/noto-sans-gujarati/gujarati-400.css';
import '@fontsource/noto-sans-gujarati/gujarati-700.css';
// Signal Shala (the school website's fonts)
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import '@fontsource/radio-canada-big/latin-600.css';
import '@fontsource/radio-canada-big/latin-700.css';
// Blackboard (handwritten headings)
import '@fontsource/kalam/latin-700.css';
import '@fontsource/kalam/devanagari-700.css';
// Notebook
import '@fontsource/hind/latin-400.css';
import '@fontsource/hind/latin-600.css';
import '@fontsource/hind/latin-700.css';
import '@fontsource/hind/devanagari-400.css';
import '@fontsource/hind/devanagari-600.css';
import '@fontsource/hind/devanagari-700.css';
import '@fontsource/hind-vadodara/gujarati-400.css';
import '@fontsource/hind-vadodara/gujarati-600.css';
import '@fontsource/hind-vadodara/gujarati-700.css';
// Marigold
import '@fontsource/baloo-2/latin-400.css';
import '@fontsource/baloo-2/latin-600.css';
import '@fontsource/baloo-2/latin-700.css';
import '@fontsource/baloo-2/devanagari-400.css';
import '@fontsource/baloo-2/devanagari-600.css';
import '@fontsource/baloo-2/devanagari-700.css';
import '@fontsource/baloo-bhai-2/gujarati-400.css';
import '@fontsource/baloo-bhai-2/gujarati-600.css';
import '@fontsource/baloo-bhai-2/gujarati-700.css';
// High contrast
import '@fontsource/atkinson-hyperlegible/latin-400.css';
import '@fontsource/atkinson-hyperlegible/latin-700.css';
