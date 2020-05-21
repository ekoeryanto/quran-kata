const fs = require('fs')
const { spawnSync } = require('child_process')

const [surah, ayahFrom = 1, ...others] = process.argv.splice(2)

const transcript = require(`../arabic/${surah}.json`)

const continued = others.includes('-c') || others.includes('--resume') || others.includes('-r')

for (const ayah of Object.keys(transcript).filter(x => +x >= +ayahFrom)) {
  const words = transcript[ayah].split('//').length
  // download format 001_002_003 [surah_ayah_word]
  for (let word = 1; word <= words; word++) {
    const filename = [surah, ayah, word].map((x) => String(x).padStart(3, '0')).join('_')
    const targetFile = `./${surah}/${filename}.mp3`
    if (continued || !fs.existsSync(targetFile)) {
      const curl = spawnSync('curl', ['-LOC', '-', getURL(surah, filename)], { cwd: `./${surah}` })
    }
  }
  console.log(`surah ${surah}:${ayah} done`)
}

function getURL(surah, fname) {
  return `https://words.audios.quranwbw.com/${surah}/${fname}.mp3`
}