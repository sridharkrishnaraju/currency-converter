# Usage & API

It is a standard custom element, so it works with no wrapper in plain HTML, React, Vue, Svelte and Astro.

## Plain HTML

```html
<script src="currency-converter.js"></script>
<currency-converter></currency-converter>
```

## React

```jsx
import "@sgbp/currency-converter";
export default function Page() { return <currency-converter />; }
```

## Vue

```vue
<script setup>
import "@sgbp/currency-converter";
</script>

<template>
  <currency-converter />
</template>
```

---

Prefer to just use it without installing anything? The
[live Currency Converter](https://sgbp.tech/tools/currency-converter) is hosted and ready to go.
