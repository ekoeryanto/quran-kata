const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const Progress = require('cli-progress')

const bar1 = new Progress.SingleBar({}, Progress.Presets.shades_classic)

const [surah, ayahFrom = 1, ...others] = process.argv.splice(2)

const baseDir = path.join(__dirname, 'ayah', surah)

const transcript = require(`../arabic/${surah}.json`)
const transcriptKeys = Object.keys(transcript)

const continued = others.includes('-c') || others.includes('--resume') || others.includes('-r')

console.log(` * Downloading surah #${surah}`)
bar1.start(transcriptKeys.length, 0)
for (const ayah of transcriptKeys.filter(x => +x >= +ayahFrom)) {
  // download format 001002 [surah+ayah]
  const filename = [surah, ayah].map(x => String(x).padStart(3, '0')).join('')
  const targetFile = path.join(baseDir, `${filename}.mp3`)
  const url = `https://arabic-ayah-1.audios.quranwbw.com/${filename}.mp3`
  if (continued || !fs.existsSync(targetFile)) {
    spawnSync('curl', ['-LOC', '-', url], { cwd: baseDir })
  }
  bar1.update(+ayah)
}

bar1.stop()
