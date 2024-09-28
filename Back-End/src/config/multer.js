import { S3Client } from '@aws-sdk/client-s3'
import crypto from 'crypto'
import multer from 'multer'
import multerS3 from 'multer-s3'
import dotenv from 'dotenv'

dotenv.config()


const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
      accessKeyId: process.env.AWS_ACESS_KEY_ID ,
      secretAccessKey: process.env.AWS_SECRET_ACESS_KEY 
  }
})

const storage = multerS3({
  s3: s3,
  bucket: process.env.BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: 'public-read',
  key: (req, file, cb) => {
    crypto.randomBytes(16, (err, hash) => {
      if (err) cb(err)

      const fileName = `${hash.toString('hex')}-${file.originalname}`
      cb(null, fileName)
    })
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/jpg'
    ]

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Tipo de arquivo inválido.'))
    }
  }
})

export default upload
