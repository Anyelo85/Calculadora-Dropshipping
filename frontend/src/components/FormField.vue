<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  modelValue: string;
  unit?: string;
}>();

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <div class="control">
      <input
        :id="id"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        :value="modelValue"
        :class="{ 'has-unit': unit }"
        @input="onInput"
      />
      <span v-if="unit" class="unit">{{ unit }}</span>
    </div>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

label {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-muted);
}

.control {
  position: relative;
}

input {
  width: 100%;
  padding: 10px 12px;
  background: #0f172a;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: 14px;
  font-family: inherit;
}

input.has-unit {
  padding-right: 54px;
}

input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.unit {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  pointer-events: none;
}
</style>
