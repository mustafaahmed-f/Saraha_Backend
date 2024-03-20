import multer from 'multer'

import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234abcd', 4) // 'a2b4'

import fs from 'fs'
import path from 'path'
import { allowedExtensions } from '../utils/allowedExtensions.js'
export const multerLocalFunction = (allowedExtensionsArr, customPath) => {
  // storage
  if (!allowedExtensionsArr) allowedExtensionsArr = allowedExtensions.Images
  if (!customPath) customPath = 'General'
  // const storage = multer.memoryStorage()

  // console.log(path.resolve(`uploads/${customPath}`))
  // fs
  if (!fs.existsSync(`uploads/${customPath}`)) {
    // create
    fs.mkdirSync(`uploads/${customPath}`, { recursive: true })
  }

  //========================== Storage ================
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`uploads/${customPath}`))
    },

    filename: function (req, file, cb) {
      const uniqueFileName = nanoid() + '_' + file.originalname
      // console.log({
      //   original: file.originalname,
      //   uniqueFileName,
      // })
      cb(null, uniqueFileName)
    },
  })

  //=========================== file filter ====================
  const fileFilter = function (req, file, cb) {
    // console.log(file)

    // console.log({
    //   allowedExtensionsArr,
    //   mim: file.mimetype,
    //   cod: allowedExtensionsArr.includes(file.mimetype),
    // })

    if (allowedExtensionsArr.includes(file.mimetype)) {
      return cb(null, true)
    }

    cb('in-valid extension', false)
  }

  const fileUpload = multer({ fileFilter, storage })
  return fileUpload
}
