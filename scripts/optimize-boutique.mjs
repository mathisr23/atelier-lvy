// Script ponctuel : compresse les photos brutes de src/assets/boutique/produits
// vers des WebP légers (thumb + full) utilisés par la page Boutique.
// Usage : node scripts/optimize-boutique.mjs

import sharp from 'sharp'
import { readdir, mkdir, stat } from 'fs/promises'
import path from 'path'

const SRC_DIR = path.resolve('src/assets/boutique/produits')
const OUT_DIR = path.resolve('src/assets/boutique/optimized')

const SIZES = {
  thumb: { width: 700, quality: 75 },
  full: { width: 1600, quality: 82 },
}

async function main() {
  await mkdir(path.join(OUT_DIR, 'thumb'), { recursive: true })
  await mkdir(path.join(OUT_DIR, 'full'), { recursive: true })

  const files = (await readdir(SRC_DIR)).filter(f => /\.(jpe?g|png)$/i.test(f))
  console.log(`${files.length} photos à optimiser…`)

  let totalBefore = 0
  let totalAfter = 0

  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file)
    const base = file.replace(/\.(jpe?g|png)$/i, '').toLowerCase()
    totalBefore += (await stat(srcPath)).size

    for (const [variant, opts] of Object.entries(SIZES)) {
      const outPath = path.join(OUT_DIR, variant, `${base}.webp`)
      await sharp(srcPath)
        .rotate() // corrige l'orientation EXIF
        .resize({ width: opts.width, withoutEnlargement: true })
        .webp({ quality: opts.quality })
        .toFile(outPath)
    }

    totalAfter += (await stat(path.join(OUT_DIR, 'full', `${base}.webp`))).size
    console.log(`✓ ${file} → ${base}.webp`)
  }

  const mb = n => (n / 1024 / 1024).toFixed(1)
  console.log(`\nTerminé. ${files.length} photos optimisées dans src/assets/boutique/optimized/{thumb,full}/`)
  console.log(`Poids original : ${mb(totalBefore)} Mo → poids "full" webp : ${mb(totalAfter)} Mo`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
