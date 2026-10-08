// ponytail: guardrail kecil — route name harus unik dan tidak ada path duplikat.
// Jalankan: node scripts/check-router.mjs
// Cek ini gagal kalau ada regresi router (seperti route admin yang terselip
// ke top-level dan bentrok dengan route customer).

import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

const src = readFileSync(fileURLToPath(new URL('../src/router/index.js', import.meta.url)), 'utf8')

const routesBlock = src.slice(src.indexOf('const routes = ['), src.indexOf('const router ='))

const names = [...routesBlock.matchAll(/name:\s*'([^']+)'/g)].map((m) => m[1])
const dupNames = names.filter((n, i) => names.indexOf(n) !== i)
assert.equal(dupNames.length, 0, `route name duplikat: ${[...new Set(dupNames)].join(', ')}`)

// Path top-level tidak boleh mewarisi path parent /admin (akibatnya bentrok nama).
const topLevel = [...routesBlock.matchAll(/^\s{4}path: '([^']*)'/gm)].map((m) => m[1])
const nested = [...routesBlock.matchAll(/^\s{8}path: '([^']*)'/gm)].map((m) => m[1])
const leaked = nested.filter((p) => !p.startsWith('admin') && topLevel.includes(p))
assert.equal(leaked.length, 0, `path top-level bentrok dengan child /admin: ${leaked.join(', ')}`)

console.log(`ok — ${names.length} route, nama unik, tidak ada path bocor`)