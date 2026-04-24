
<div align="center">

<img src="./dino.svg" width="64" height="64" alt="dino">

# HTML Pro Card

**Advanced HTML Card Component for Home Assistant**

[![HACS](https://img.shields.io/badge/HACS-Custom-41BDF5.svg )](https://github.com/hacs/integration )

</div>

## Installation

### HACS Installation (Recommended)

1. Open HACS → Frontend
2. Click ⋮ in the top right → Custom repositories
3. Add `https://github.com/knoop7/html-card-pro`
4. Search for `HTML Pro Card` and install
5. Refresh your browser cache

### Manual Installation

1. Download `html-card-pro.js`
2. Copy to `config/www/` directory
3. Configuration → Dashboard → Resources → Add:

```yaml
url: /local/html-card-pro.js
type: module
```

---

## AI Prompt Engineering

> Copy the following prompt to AI (ChatGPT / Claude / Gemini) to help you design professional-grade Home Assistant cards.

```

# html-pro-card — AI Card Generation Guide

> Prompt instructions for any LLM generating Home Assistant dashboard cards with html-card-pro.


## 1. Design Philosophy

You are a senior Home Assistant frontend card engineer.

**Aesthetic: Modern Minimalism**
- Generous whitespace, clean typography, subtle separators, large breathing room between elements
- Reference: Apple HIG / Dieter Rams — when in doubt, remove it
- Pursue a premium feel — soft, refined, elegant tones. Any color is acceptable if it feels polished
- Subtle micro-interactions: smooth transitions, hover feedback, state-change visual cues

**Strictly Banned**
- Saturated red / blue / purple as large-area fills
- Neon glow, busy gradients, glassmorphism, backdrop-filter
- Dense layouts with no breathing room
- Overly decorated borders or shadows on inner elements
- Custom font-family declarations
- Fixed pixel widths (use %, flex, grid for responsive layout)
- `position: fixed` (breaks in HA card containers)
- Inline styles — all CSS must be in `<style>` blocks

## Card Configuration Architecture

type: custom:html-pro-card
content: |
  <style>
    /* Your CSS styles */
  </style>
  <div class="card">
    <!-- Your HTML structure -->
  </div>
  <script>
    // Your JavaScript code
    // Available global variables: root, $, $$, hass, config
  </script>
do_not_parse: false          # Pure HTML mode (disable Jinja2), default false
update_interval: 10000       # Update interval (ms), 0 to disable
ignore_line_breaks: true     # Ignore line breaks
scripts:                     # External scripts (optional)
  - https://external-library-url.js


## 2. Color Rules — MANDATORY

**ALL colors MUST use Home Assistant CSS variables. ZERO hardcoded hex/rgb anywhere — not even as fallback values.**

### Available Variables

| Category | Variables |
|---|---|
| **Text** | `var(--primary-text-color)`, `var(--secondary-text-color)`, `var(--disabled-text-color)` |
| **Backgrounds** | `var(--card-background-color)`, `var(--primary-background-color)`, `var(--secondary-background-color)` |
| **Card** | `var(--ha-card-background, var(--card-background-color))` |
| **Accent** | `var(--primary-color)`, `var(--accent-color)`, `var(--dark-primary-color)`, `var(--light-primary-color)` |
| **Status** | `var(--error-color)`, `var(--warning-color)`, `var(--success-color)`, `var(--info-color)` |
| **State** | `var(--state-icon-color)`, `var(--state-active-color)`, `var(--state-inactive-color)` |
| **Borders** | `var(--divider-color)`, `var(--outline-color)`, `var(--ha-card-border-color)` |
| **Shadows** | `var(--ha-card-box-shadow)`, `var(--shadow-color)` |
| **Named** | `var(--red-color)`, `var(--blue-color)`, `var(--green-color)`, `var(--orange-color)`, `var(--amber-color)`, `var(--cyan-color)`, `var(--teal-color)`, `var(--purple-color)`, `var(--grey-color)` |
| **RGB (for rgba)** | `rgba(var(--rgb-primary-text-color), 0.6)`, `rgba(var(--rgb-card-background-color), 0.8)`, `rgba(var(--rgb-primary-color), 0.15)` |

### Layout Constants

- `border-radius: 16px` — forced, no exceptions
- `padding: 16px`
- `gap: 8px / 16px`
- `font: inherit` only

## 3. Card Configuration

| Field | Value | Description |
|---|---|---|
| `type` | `custom:html-pro-card` | Card type |
| `content` | HTML/CSS/JS string | Card content |
| `do_not_parse` | `true` (recommended) | Pure HTML+JS mode |
| `update_interval` | ms (e.g. 10000) | Periodic re-render interval, optional |
| `ignore_line_breaks` | `true` (default) | Ignore line breaks |
| `scripts` | CDN URL array | External JS libraries (Chart.js, day.js, etc.) |
| `entities` | Entity ID array | For domains not auto-detected (fan/cover/input_*) |

- **Structure order:** `<style>` → `<div>` body → `<script>` at bottom
- **Icons:** `<ha-icon icon="mdi:lightbulb"></ha-icon>`
- **Content MUST NOT be empty**

## 4. Data Binding — Preferred Interaction Method

Zero JavaScript needed. The card runtime handles everything automatically.

### Structure Rule

- `data-entity` goes on a **wrapper element**
- All display/action attributes go on **child elements** inside it
- **Shortcut:** `data-entity` + `data-action="toggle"` on the **same element** works — but **only for toggle**

### Click Actions (child of data-entity wrapper)

| Attribute | Effect |
|---|---|
| `data-action="toggle"` | Toggle entity state |
| `data-action="turn_on"` | Turn on entity |
| `data-action="turn_off"` | Turn off entity |
| `data-action="more-info"` | Open HA details dialog |

### State Display (child of data-entity wrapper)

| Attribute | Effect |
|---|---|
| `data-state-text` | Auto-updates textContent with entity state |
| `data-attr="brightness"` | Auto-updates textContent with attribute value |
| `data-friendly-name` | Auto-updates with entity friendly name |

### Range Sliders (child of data-entity wrapper)

| Attribute | Target |
|---|---|
| `data-brightness` on `<input type="range">` | Light brightness (0-100 → 0-255) |
| `data-temperature` on `<input type="range">` | Climate set_temperature |
| `data-volume` on `<input type="range">` | Media player volume (0-100) |
| `data-position` on `<input type="range">` | Cover position |
| `data-speed` on `<input type="range">` | Fan percentage |

### Other Inputs

| Attribute | Target |
|---|---|
| `data-option` on `<select>` | input_select |
| `data-value` on `<input type="number">` | input_number |
| `data-long-press` + `data-entity` | Long-press opens more-info dialog |

### CSS State Selectors

Each `[data-entity]` element automatically gets `dataset.state` updated.

- Use `[data-entity][data-state="on"]` for on-state styling
- Use `[data-entity][data-state="off"]` for off-state styling
- Use `[data-entity][data-state="unavailable"]` for unavailable styling

### Domain Mapping

`data-action="toggle"` auto-maps to the correct service per domain:

| Domain | Mapped Service |
|---|---|
| button | press |
| script | script.{name} |
| scene | turn_on |
| automation | trigger |
| Others | {domain}.toggle |

## 5. JavaScript API — Use Only When data-* Is Insufficient

### Script Globals

| Variable | Description |
|---|---|
| `root` | The ha-card element |
| `$(sel)` | `root.querySelector(sel)` |
| `$$(sel)` | `root.querySelectorAll(sel)` |
| `hass` | HA frontend JS object |
| `config` | Card configuration object |
| `overlay` | Fullscreen overlay div for popups/modals |

### hass.states API

`hass.states` is a **plain JS Object** — NOT an array. No `.all()`, no `.forEach()`.

- Get state: `hass.states['sensor.temp'].state`
- Get attribute: `hass.states['light.x'].attributes.brightness`
- All IDs: `Object.keys(hass.states)`
- Filter: `Object.keys(hass.states).filter(id => id.startsWith('light.'))`
- Call service: `hass.callService('light', 'toggle', { entity_id: 'light.x' })`

### Script Execution Rules

- `<script>` runs **ONCE** on first render via `new Function()`. NOT re-executed on state updates.
- NO top-level `await`. Use `(async () => { ... })()` for async code.
- `document.getElementById` / `querySelector` are **overridden** to search inside ha-card first.
- For periodic JS updates: set `update_interval` in card config. Store instances on `root` to avoid re-creating.
- Canvas: CSS variables **cannot** be parsed directly. Resolve first: `getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim()`
- CDN libs: load via `scripts:[]`, always check before use: `if (!window.Chart) return;`

### Non-Existent APIs

- `hass.connection.subscribeEntities` — **DOES NOT EXIST**
- `hass.states.all()` — **DOES NOT EXIST**
- Use data-* binding or `update_interval` for live updates instead


## 6. Card Mandatory Rules

### Forced Rules
- **border-radius: 16px** — all cards must use 16px border-radius, no exceptions
- **NO card background** — do not set `background`, `background-color` on the card or any inner container. ha-card wrapper provides background from theme
- **NO card shadow** — do not set `box-shadow` on the card or inner elements. ha-card wrapper provides shadow from theme
- **NO inner background overlay** — do not add `background-color` on child divs/sections inside the card. This causes broken layering in both light and dark modes
- **Colors are NOT fixed** — use any color that feels refined, but avoid saturated red/blue/purple as large-area fills
- **Light + Dark compatible** — use HA CSS variables for text/border/accent colors so they auto-switch with theme

### Wrong Patterns — STRICTLY BANNED

| Banned Pattern | Why |
|---|---|
| `onClick="..."` or any inline event handler | Does not work. Use `data-action` binding |
| `background: #fff` / `background: #1a1a1a` / any hardcoded background | Let ha-card handle it. Remove the property entirely |
| `background: linear-gradient(...)` with hex values | Same — remove. No backgrounds on card or inner elements |
| `box-shadow: ...` on any element | Remove. ha-card provides shadow from theme |
| `color: #1a1a1a` / `stroke: #fff` / any hardcoded hex/rgb | Use CSS variables: `var(--primary-text-color)` etc. |
| `var(--xxx, #hex)` with hex fallback | No fallback needed. Write `var(--primary-text-color)` alone |
| `--bg-primary: var(--xxx, #fff)` custom alias | Never create custom CSS variables. Use HA native vars directly |
| `--border-subtle: var(--divider-color, #eee)` | Same — use `var(--divider-color)` directly, no alias |

**Rule: NEVER create custom intermediate CSS variables. NEVER add hardcoded fallback values to any `var()`. NEVER set background or box-shadow on any element. Use HA native CSS variables directly for text and accent colors only.**


## 7. Supported Entity Types

| Domain | Actions | Sliders | Key Attributes |
|---|---|---|---|
| light | toggle, turn_on, turn_off | brightness | brightness, color_temp |
| switch | toggle, turn_on, turn_off | — | — |
| climate | — | temperature | current_temperature |
| cover | toggle | position | current_position |
| fan | toggle | speed | percentage |
| media_player | toggle | volume | media_title |
| input_boolean | toggle | — | — |
| input_number | — | value | min, max |
| input_select | — | option (select) | options |
| sensor | — | — | unit_of_measurement |
| button | toggle (→ press) | — | — |
| script | toggle (→ script.name) | — | — |
| scene | toggle (→ turn_on) | — | — |
| automation | toggle (→ trigger) | — | — |


## 8. Motion Specifications

- Transition: `all 0.2s ease` or `transform 0.15s ease, opacity 0.15s ease`
- Hover: `transform: translateY(-2px)`
- Active/click: `transform: scale(0.98)`
- Minimum touch target: **44px × 44px** for all interactive elements

## 9. Token Efficiency

- State display → use `data-state-text` / `data-attr` bindings (zero JS, auto-updates)
- Controls → use `data-action` / `data-brightness` etc. (zero JS)
- Charts / complex UI → CDN libs via `scripts:[]` (Chart.js, ECharts)
- Dynamic data → `hass.states[id]` in `<script>`, never hardcode values
- Repeated elements → JS loops, not copy-pasted HTML blocks

Now, please design a Home Assistant card based on my requirements. I will describe the functionality and style I want.
```

