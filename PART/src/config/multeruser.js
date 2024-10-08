import { S3Client } from '@aws-sdk/client-s3'
import crypto from 'crypto'
import multer from 'multer'
import multerS3 from 'multer-s3'
import dotenv from 'dotenv'

dotenv.config()

let s3

try {
  s3 = new S3Client({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACESS_KEY
    }
  })
} catch (error) {
  console.error('Erro ao inicializar o cliente S3:', error)
  throw new Error('Erro ao configurar o serviço de armazenamento S3.')
}

const generateFileName = (req, file, cb) => {
  crypto.randomBytes(16, (err, hash) => {
    if (err) {
      console.error('Erro ao gerar hash para o nome do arquivo:', err)
      return cb(new Error('Erro ao processar o arquivo, tente novamente mais tarde.'))
    }
    const fileName = `${hash.toString('hex')}-${file.originalname}`
    cb(null, fileName)
  })
}

const storage = multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: generateFileName
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
        const mimeError = new Error('Tipo de arquivo inválido. Apenas JPEG, PNG, ou JPG são permitidos.')
        mimeError.code = 'INVALID_FILE_TYPE'
        console.warn(`Arquivo com MIME type inválido: ${file.mimetype}`)
        cb(mimeError)
      }
    }
  }).single('fotos')
  
  export { upload }