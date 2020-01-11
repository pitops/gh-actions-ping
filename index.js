require('dotenv').config()

const fetch = require('node-fetch')
const Slack = require('slack-node')
const util = require('util')

const slackWebhookSecret = process.env.SLACK_WEBHOOK_SECRET

const slack = new Slack()
slack.setWebhook(`https://hooks.slack.com/services/${slackWebhookSecret}`)

// Promisify the slack webhook method
const slackWebhook = util.promisify(slack.webhook)

const URLs = [
  {
    name: 'Bookis Landing page',
    url: 'https://bookis.io'
  },
  {
    name: 'Bookis app',
    url: 'https://app.bookis.io'
  }
]

const ping = async url => {
  const res = await fetch(url)
}

const postToSlack = async message => {
  await slackWebhook({
    channel: 'services-status',
    username: 'Kokoras',
    text: message
  })
}

const getDateTimeString = () => {
  const event = new Date()

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }

  return event.toLocaleDateString('en-gb', options)
}

const main = async () => {
  const message = []
  message.push(`============================== (${getDateTimeString()}) UTC`)
  for (let i = 0; i < URLs.length; i++) {
    const { name, url } = URLs[i]
    try {
      await ping(url)

      message.push(`[*${name}*] ✅`)
    } catch (err) {
      console.error(err)
      message.push(`[*${name}*] UNREACHABLE!!! 🚨🚨🚨 \n Error: ${err.message}`)
    }
  }
  message.push('==============================')

  await postToSlack(message.join('\n'))
}

main()
