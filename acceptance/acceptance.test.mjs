import { test } from 'node:test';
import assert from 'node:assert';
import { loadTheme, saveTheme, loadMode, saveMode } from '../src/utils/storage.js';

// Mock global de localStorage para o ambiente Node.
const store = new Map();

globalThis.localStorage = {
  getItem(key) {
    return store.has(key) ? store.get(key) : null;
  },
  setItem(key, value) {
    store.set(key, String(value));
  },
  removeItem(key) {
    store.delete(key);
  },
  clear() {
    store.clear();
  },
};

function clearStorage() {
  store.clear();
}

test('tema padrão é light', () => {
  clearStorage();
  assert.strictEqual(loadTheme(), 'light');
});

test('salvar e carregar tema dark', () => {
  clearStorage();
  assert.strictEqual(saveTheme('dark'), true);
  assert.strictEqual(loadTheme(), 'dark');
});

test('tema inválido cai no padrão', () => {
  clearStorage();
  assert.strictEqual(saveTheme('foo'), false);
  const theme = loadTheme();
  assert.ok(theme === 'light' || theme === 'dark');
});

test('modo padrão é pvp', () => {
  clearStorage();
  assert.strictEqual(loadMode(), 'pvp');
});

test('salvar e carregar modo pvai', () => {
  clearStorage();
  assert.strictEqual(saveMode('pvai'), true);
  assert.strictEqual(loadMode(), 'pvai');
});

test('modo inválido cai no padrão', () => {
  clearStorage();
  assert.strictEqual(saveMode('cpu'), false);
  assert.strictEqual(loadMode(), 'pvp');
});
