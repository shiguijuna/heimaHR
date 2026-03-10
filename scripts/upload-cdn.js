const COS = require('cos-nodejs-sdk-v5')
const fs = require('fs')
const path = require('path')

const cos = new COS({
  SecretId: process.env.VUE_APP_COS_SECRET_ID,
  SecretKey: process.env.VUE_APP_COS_SECRET_KEY
})

const Bucket = 'renliziyuan-1257863609'
const Region = 'ap-guangzhou'
const cdnDir = path.join(__dirname, '..', 'temp_cdn')

const mimeTypes = {
  '.js': 'application/javascript',
  '.css': 'text/css'
}

const files = fs.readdirSync(cdnDir)

let uploaded = 0
files.forEach(file => {
  const filePath = path.join(cdnDir, file)
  const ext = path.extname(file)
  cos.putObject({
    Bucket,
    Region,
    Key: `cdn/${file}`,
    Body: fs.readFileSync(filePath),
    ContentType: mimeTypes[ext] || 'application/octet-stream'
  }, (err, data) => {
    if (err) {
      console.error(`Failed: ${file}`, err.message)
    } else {
      console.log(`Uploaded: cdn/${file} -> https://${data.Location}`)
    }
    uploaded++
    if (uploaded === files.length) {
      console.log('\nAll files uploaded!')
    }
  })
})
