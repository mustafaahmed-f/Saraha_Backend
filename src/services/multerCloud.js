import multer from 'multer'

import { allowedExtensions } from '../utils/allowedExtensions.js'
export const multerCloudFunction = (allowedExtensionsArr) => {
  // storage
  if (!allowedExtensionsArr) allowedExtensionsArr = allowedExtensions.Images

  //========================== Storage ================
  const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    },
  })

  //=========================== file filter ====================
  const fileFilter = function (req, file, cb) {
    if (allowedExtensionsArr.includes(file.mimetype)) {
      return cb(null, true)
    }

    cb('in-valid extension', false)
  }

  const fileUpload = multer({ fileFilter, storage })
  return fileUpload
}
