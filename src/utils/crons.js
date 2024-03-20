import { scheduleJob, RecurrenceRule } from 'node-schedule'  // "Route2023  "
//===================================== cronOne ==============================
export const cronOne = () => {
  scheduleJob('* * * * * *', function () {
    console.log('CronOne run every second')
    // const users=  await userModel.find({isLogged: true })
  })
}
//===================================== cronTwo ==============================
export const crontwo = () => {
  scheduleJob({ minute: 5, second: 20 }, function () {
    console.log('CronTwo run 11:6:10 seconds')
  })
}
//===================================== cronRe ==============================
export const cronRe = () => {
  const rule = new RecurrenceRule()
  rule.hour = 13
  rule.minute = 23
  rule.second = 2
  rule.tz = 'Africa/Cairo'
  scheduleJob(rule, function () {
    console.log('CronRe run 12:9:2 seconds')
  })
}
