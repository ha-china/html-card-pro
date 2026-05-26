# HTML Pro Card v5.8 Release Notes

## What's New

### 🎨 UI Refinements
- Lighter colors for titles and version badges
- Pure white background for "View Details" button
- Subtle shadows for collapse panels, search bar, and code editor
- Removed hover-zoom effect from module cards

### 🌍 Multi-Language Support
- Card description now supports: English, Simplified Chinese, Traditional Chinese, Japanese, German
- Configuration editor fully localized with automatic language detection based on Home Assistant settings

### 🔧 Bug Fixes
- **Fixed**: `border-radius: 50%` no longer forced to `10px` - circular elements now render correctly
- **Fixed**: Missing `_loadStoreModules` method causing refresh button error
- **Fixed**: Update interval input field now displays correctly with native number input

### 🚀 Module Store Improvements
- Modules now stored as individual YAML files in `mods/` folder
- GitHub Actions automatically syncs modules from Discussions
- Security validation blocks unsafe external URLs and dangerous code patterns
- Removed image click-to-zoom (preview only)

### ⚡ Performance
- Hook-based priority loading ensures HTML Pro Card loads first among custom cards
- Simplified console output

## New Modules

### 3D Compass (`mods/9-compass.yaml`)
High-precision compass with Canvas rendering and physics-based animation. Supports phone heading, altitude, and pressure sensors.

### Synology NAS Panel (`mods/10-synology-nas.yaml`)
3D drive bay panel with mechanical eject animation powered by Anime.js. Displays disk temperatures, system stats, and UPS status.

## Installation

### HACS (Recommended)
1. Add this repository to HACS as a custom repository
2. Search for "HTML Pro Card" and install
3. Refresh your browser

### Manual
1. Download `dist/html-card-pro.js`
2. Copy to `config/www/community/html-card-pro/`
3. Add resource in Lovelace configuration

## Contributing Modules

1. Create a new Discussion with title format: `[Category] Module Name`
2. Use the template format with YAML code block
3. GitHub Actions will automatically sync to the module store

## Links
- [GitHub Repository](https://github.com/ha-china/html-card-pro)
- [Module Store Discussions](https://github.com/ha-china/html-card-pro/discussions)
- [Report Issues](https://github.com/ha-china/html-card-pro/issues)
