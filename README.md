# Prodeko visual asset library

**This package is still experimental**

## Usage

```text
npm install --save-dev git+ssh://git@github.com:prodeko/visual-assets#semver:latest
```

```tsx
// import the logo
import { logos } from "@prodeko/visual-assets"

// select the logo you want using #

function Logo() {
    return (
        <svg className="w-64 h-64 text-white">
          <use href={`${logos}#logo`} />
        </svg>
    )
}
function LogoWithText() {
    return (
        <svg className="w-64 h-64 text-white">
          <use href={`${logos}#logo-text`} />
        </svg>
        )
    }
function ProdekoBlueLogo() {
    return (
        <svg className="w-64 h-64 text-[#002e7d]">
          <use href={`${logos}#logo-text`} />
        </svg>
        )
    }
```