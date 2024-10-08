import crypto from 'crypto'
import { S3Client } from '@aws-sdk/client-s3'
import { upload } from '../src/config/multer.js'
import multerS3 from 'multer-s3'

jest.mock('crypto')
jest.mock('@aws-sdk/client-s3')
jest.mock('multer-s3')

describe('Upload Config', () => {
  let req, res, next

  beforeEach(() => {
    req = { files: [] }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()
  })

  it('deve configurar corretamente o cliente S3', () => {
    expect(S3Client).toHaveBeenCalledWith({
      region: process.env.AWS_DEFAULT_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACESS_KEY
      }
    })
  })

  it('deve gerar o nome do arquivo corretamente', () => {
    const fakeHash = Buffer.from('1234567890123456')
    crypto.randomBytes.mockImplementation((size, callback) => callback(null, fakeHash))

    const cb = jest.fn()
    const file = { originalname: 'test.png' }

    
    multerS3.mockImplementation(() => ({
      key: (req, file, cb) => {
        const hash = fakeHash.toString('hex')
        const fileName = `${hash}-${file.originalname}`
        cb(null, fileName)
      }
    }))

    const generateFileName = multerS3.mock.calls[0][0].key
    generateFileName(req, file, cb)

    expect(cb).toHaveBeenCalledWith(null, `31323334353637383930313233343536-test.png`)
  })

  it('deve retornar erro se falhar ao gerar o hash do nome do arquivo', () => {
    const cb = jest.fn()
    const file = { originalname: 'test.png' }
    crypto.randomBytes.mockImplementation((size, callback) => callback(new Error('Hash generation failed')))

    
    multerS3.mockImplementation(() => ({
      key: (req, file, cb) => {
        cb(new Error('Erro ao processar o arquivo, tente novamente mais tarde.'))
      }
    }))

    const generateFileName = multerS3.mock.calls[0][0].key
    generateFileName(req, file, cb)

    expect(cb).toHaveBeenCalledWith(new Error('Erro ao processar o arquivo, tente novamente mais tarde.'))
  })

  it('deve permitir arquivos de tipos válidos', () => {
    const file = { mimetype: 'image/jpeg' }
    const cb = jest.fn()

    
    upload.fileFilter = (req, file, cb) => {
      const isValid = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)
      if (isValid) cb(null, true)
      else cb(new Error('Tipo de arquivo inválido. Apenas JPEG, PNG, ou JPG são permitidos.'), false)
    }

    const fileFilter = upload.fileFilter
    fileFilter(req, file, cb)

    expect(cb).toHaveBeenCalledWith(null, true)
  })

  it('deve rejeitar arquivos de tipos inválidos', () => {
    const file = { mimetype: 'application/pdf' }
    const cb = jest.fn()
  
    
    upload.fileFilter = (req, file, cb) => {
      const isValid = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)
      if (!isValid) {
        const error = new Error('Tipo de arquivo inválido. Apenas JPEG, PNG, ou JPG são permitidos.')
        error.code = 'INVALID_FILE_TYPE'
        cb(error, false)
      } else {
        cb(null, true)
      }
    }
  
    const fileFilter = upload.fileFilter
    fileFilter(req, file, cb)
  
    
    expect(cb).toHaveBeenCalledWith(expect.any(Error), false)
    expect(cb.mock.calls[0][0].message).toBe('Tipo de arquivo inválido. Apenas JPEG, PNG, ou JPG são permitidos.')
    expect(cb.mock.calls[0][0].code).toBe('INVALID_FILE_TYPE')
  })
  
})
