const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const Progress = require('cli-progress')

const bar1 = new Progress.SingleBar({}, Progress.Presets.shades_classic)

const [surah, ayahFrom = 1, ...others] = process.argv.splice(2)

const baseDir = path.join(__dirname, 'words', surah)

const transcript = require(`../arabic/${surah}.json`)
const transcriptKeys = Object.keys(transcript)

const continued = others.includes('-c') || others.includes('--resume') || others.includes('-r')

console.log(` * Downloading surah #${surah} words`)
bar1.start(transcriptKeys.length, 0)
for (const ayah of transcriptKeys.filter(x => +x >= +ayahFrom)) {
  const words = transcript[ayah].split('//').length
  // download format 001_002_003 [surah_ayah_word]
  for (let word = 1; word <= words; word++) {
    const filename = [surah, ayah, word].map(x => String(x).padStart(3, '0')).join('_')
    const targetFile = path.join(baseDir, `${filename}.mp3`)
    if (continued || !fs.existsSync(targetFile)) {
      spawnSync('curl', ['-LOC', '-', getURL(surah, filename)], { cwd: baseDir })
    }
  }
  bar1.update(+ayah)
  // console.log(`surah ${surah}:${ayah} done`)
}

bar1.stop()

function getURL (surah, fname) {
  return `https://words.audios.quranwbw.com/${surah}/${fname}.mp3`
}
