// Minimal QR Code encoder (ISO/IEC 18004): byte mode, ECC level M, versions 1-6.
// Same structure as the C++ lib in Hugolelis/qrcode-lib: data → Reed-Solomon →
// interleave → function patterns → zig-zag placement → mask → format bits.
// ponytail: mask penalty skips rule 3 (finder-like runs); every mask decodes, this only
// affects how "ideal" the pick is. Add it, and versions ≥7 (version-info bits), if longer text is needed.

const ECC_PER_BLOCK = [0, 10, 16, 26, 18, 24, 16] // level M
const NUM_BLOCKS = [0, 1, 1, 1, 2, 2, 4]

const rawModules = (v: number) => {
  let r = (16 * v + 128) * v + 64
  if (v >= 2) {
    const n = Math.floor(v / 7) + 2
    r -= (25 * n - 10) * n - 55
  }
  return r
}
const dataCodewords = (v: number) => Math.floor(rawModules(v) / 8) - ECC_PER_BLOCK[v] * NUM_BLOCKS[v]

// GF(256), x^8 + x^4 + x^3 + x^2 + 1
function gmul(x: number, y: number) {
  let z = 0
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d)
    z ^= ((y >>> i) & 1) * x
  }
  return z
}

function rsDivisor(degree: number) {
  const r = new Array<number>(degree).fill(0)
  r[degree - 1] = 1
  let root = 1
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      r[j] = gmul(r[j], root)
      if (j + 1 < degree) r[j] ^= r[j + 1]
    }
    root = gmul(root, 2)
  }
  return r
}

function rsRemainder(data: number[], divisor: number[]) {
  const r = new Array<number>(divisor.length).fill(0)
  for (const b of data) {
    const f = b ^ r.shift()!
    r.push(0)
    divisor.forEach((c, i) => { r[i] ^= gmul(c, f) })
  }
  return r
}

export function qrMatrix(text: string): boolean[][] {
  const bytes = [...new TextEncoder().encode(text)]
  let ver = 1
  while (ver <= 6 && 4 + 8 + bytes.length * 8 > dataCodewords(ver) * 8) ver++
  if (ver > 6) throw new Error('qr: text too long for versions 1-6')

  // 1. bit stream: mode 0100, 8-bit count, bytes, terminator, pad bytes
  const bits: number[] = []
  const push = (val: number, len: number) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1) }
  push(0b0100, 4)
  push(bytes.length, 8)
  bytes.forEach(b => push(b, 8))
  const cap = dataCodewords(ver) * 8
  push(0, Math.min(4, cap - bits.length))
  push(0, (8 - (bits.length % 8)) % 8)
  for (let pad = 0xec; bits.length < cap; pad ^= 0xec ^ 0x11) push(pad, 8)
  const data: number[] = []
  for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(''), 2))

  // 2. split into blocks, add Reed-Solomon ECC, interleave
  const nb = NUM_BLOCKS[ver]
  const eccLen = ECC_PER_BLOCK[ver]
  const raw = Math.floor(rawModules(ver) / 8)
  const shortBlocks = nb - (raw % nb)
  const shortLen = Math.floor(raw / nb)
  const div = rsDivisor(eccLen)
  const blocks: number[][] = []
  for (let i = 0, k = 0; i < nb; i++) {
    const dat = data.slice(k, k + shortLen - eccLen + (i < shortBlocks ? 0 : 1))
    k += dat.length
    const ecc = rsRemainder(dat, div)
    if (i < shortBlocks) dat.push(0)
    blocks.push(dat.concat(ecc))
  }
  const codewords: number[] = []
  for (let i = 0; i < blocks[0].length; i++) {
    blocks.forEach((blk, j) => {
      if (i !== shortLen - eccLen || j >= shortBlocks) codewords.push(blk[i])
    })
  }

  // 3. function patterns
  const size = ver * 4 + 17
  const mod = Array.from({ length: size }, () => new Array<boolean>(size).fill(false))
  const fn = Array.from({ length: size }, () => new Array<boolean>(size).fill(false))
  const set = (x: number, y: number, dark: boolean) => { mod[y][x] = dark; fn[y][x] = true }
  for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0) }
  const finder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const d = Math.max(Math.abs(dx), Math.abs(dy))
      const x = cx + dx, y = cy + dy
      if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, d !== 2 && d !== 4)
    }
  }
  finder(3, 3); finder(size - 4, 3); finder(3, size - 4)
  if (ver >= 2) { // one alignment pattern for v2-6, at the bottom-right
    const c = size - 7
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(c + dx, c + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
  }
  const formatBits = (mask: number) => {
    const d = (0 << 3) | mask // ECC level M = 00
    let rem = d
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537)
    const bits = ((d << 10) | rem) ^ 0x5412
    const bit = (i: number) => ((bits >>> i) & 1) !== 0
    for (let i = 0; i <= 5; i++) set(8, i, bit(i))
    set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8))
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i))
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i))
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i))
    set(8, size - 8, true)
  }
  formatBits(0) // reserve the area so data placement skips it

  // 4. zig-zag placement of the codeword bits
  for (let i = 0, right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) {
      const x = right - j
      const y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert
      if (!fn[y][x] && i < codewords.length * 8) {
        mod[y][x] = ((codewords[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0
        i++
      }
    }
  }

  // 5. pick the mask with the lowest penalty (rules 1, 2, 4)
  const MASKS = [
    (x: number, y: number) => (x + y) % 2 === 0,
    (_: number, y: number) => y % 2 === 0,
    (x: number) => x % 3 === 0,
    (x: number, y: number) => (x + y) % 3 === 0,
    (x: number, y: number) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
    (x: number, y: number) => ((x * y) % 2) + ((x * y) % 3) === 0,
    (x: number, y: number) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
    (x: number, y: number) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
  ]
  const masked = (m: number) => mod.map((row, y) => row.map((v, x) => (!fn[y][x] && MASKS[m](x, y) ? !v : v)))
  const penalty = (g: boolean[][]) => {
    let p = 0
    for (const line of [g, g[0].map((_, x) => g.map(r => r[x]))]) for (const row of line) {
      for (let x = 0, run = 1; x < size - 1; x++) {
        run = row[x] === row[x + 1] ? run + 1 : 1
        if (run === 5) p += 3
        else if (run > 5) p++
      }
    }
    for (let y = 0; y < size - 1; y++) for (let x = 0; x < size - 1; x++) {
      if (g[y][x] === g[y][x + 1] && g[y][x] === g[y + 1][x] && g[y][x] === g[y + 1][x + 1]) p += 3
    }
    const dark = g.flat().filter(Boolean).length
    return p + Math.floor(Math.abs(dark * 20 - size * size * 10) / (size * size)) * 10
  }
  let best = 0, bestP = Infinity
  for (let m = 0; m < 8; m++) {
    const p = penalty(masked(m))
    if (p < bestP) { best = m; bestP = p }
  }
  formatBits(best) // overwrite the reserved format area with the chosen mask
  return masked(best)
}
