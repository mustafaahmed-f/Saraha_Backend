import { messageModel } from '../../../../DB/model/Message.model.js'
import userModel from '../../../../DB/model/User.model.js'
import { asyncHandler } from '../../../utils/errorHandling.js'

//======================== send message ========================
export const sendMessage = asyncHandler(async (req, res, next) => {
  const { content, sendTo } = req.body

  // usercheck
  const isUserExists = await userModel.findById(sendTo)
  if (!isUserExists) {
    return next(new Error('invaid user', { cause: 400 }))
  }

  //   const newMessage = new messageModel({ content, sendTo }) // message
  //   const message = await newMessage.save()

  const newMessage = await messageModel.create({ content, sendTo })
  res.status(201).json({ message: 'Done', message: newMessage })
})

//======================== get messages for loggedIn User =====================
export const getMessages = asyncHandler(async (req, res, next) => {
  const { _id } = req.user

  const messages = await messageModel.find({
    sendTo: _id,
  }) // [] or [{},{}]

  if (messages.length) {
    return res.status(200).json({ message: 'done', messages })
  }
  return res.status(200).json({ message: 'empty inbox' })
})

//======================== delete message ========================
export const deleteMessages = asyncHandler(async (req, res, next) => {
  const { _id } = req.user
  const { messageId } = req.params

  const message = await messageModel.findOneAndDelete({
    _id: messageId,
    sendTo: _id,
  })

  if (!message) {
    return next(new Error('fail to delete', { cause: 400 }))
  }
  res.status(200).json({ message: 'Done', message })
})
