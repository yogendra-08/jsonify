# Contributing to JSONify

Thanks for your interest in improving JSONify!

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork:
```bash
   git clone https://github.com/<your-username>/jsonify.git
   cd jsonify
```
3. **Create a branch:**
```bash
   git checkout -b feature/my-change
```

## Making Changes

- Keep to HTML, CSS, and vanilla JavaScript. No frameworks, packages, or build tools.
- Keep code in `index.html`, `style.css`, and `script.js`.
- Never render user JSON with `innerHTML`, and avoid `eval()`.
- Preserve accessibility: labels, focus styles, and `aria-live` status updates.

## Testing Locally

Open `index.html` in your browser and manually check: format, validate, minify, copy, sample, clear, empty/whitespace input, invalid JSON, and mobile layout. Confirm there are no console errors.

## Submitting a Pull Request

1. Commit with a clear message:
```bash
   git commit -m "Add: short description"
```
2. Push your branch: `git push origin feature/my-change`
3. Open a pull request describing what changed and how you tested it.