import qrCode from 'qrcode'

export const qrCodeGeneration = ({ data = '' } = {}) => {
  const qrCodedata = qrCode.toDataURL(JSON.stringify(data), {
    errorCorrectionLevel: 'H',
    // type: 'image/jpeg',
    // quality: 0.3,
    // margin: 1,
    // color: {
    //   dark: '#010599FF',
    //   light: '#FFBF60FF',
    // },
  })
  return qrCodedata
}
