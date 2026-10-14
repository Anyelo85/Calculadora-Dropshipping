<script setup lang="ts">
import CalculatorView from './views/CalculatorView.vue';
</script>

<template>
  <CalculatorView />
</template>

<style>
:root {
  --bg-0: #0b1120;
  --surface: rgba(255, 255, 255, 0.045);
  --surface-strong: rgba(255, 255, 255, 0.07);
  --border: rgba(148, 163, 184, 0.16);
  --border-strong: rgba(148, 163, 184, 0.3);
  --text: #e2e8f0;
  --text-soft: #cbd5e1;
  --text-muted: #94a3b8;
  --accent: #38bdf8;
  --accent-strong: #2563eb;
  --accent-soft: rgba(56, 189, 248, 0.16);
  --profit: #4ade80;
  --loss: #f87171;
  --danger: #fca5a5;
  --radius: 18px;
  --radius-sm: 11px;
  --font: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  height: 100%;
}

body {
  height: 100vh;
  padding: 24px 22px;
  font-family: var(--font);
  color: var(--text);
  overflow: hidden;
  background-color: var(--bg-0);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

#app {
  height: 100%;
}

@media (max-width: 900px), (max-height: 660px) {
  body {
    height: auto;
    min-height: 100vh;
    overflow: auto;
    padding: 22px 18px;
  }

  #app {
    height: auto;
  }
}
</style>
