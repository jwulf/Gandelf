// Azure Settings
const AzureConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
const QueueName = process.env.AZURE_STORAGE_QUEUE_NAME
const AzureFilter = process.env.AZURE_FILTER
// Seq Settings
const SEQ_URL = process.env.SEQ_URL
const SEQ_API_KEY = process.env.SEQ_API_KEY
// Slack Settings
const bot_token = process.env.SLACK_API_TOKEN
const rate_limit = process.env.RATE_LIMIT || 400 // 400 milliseconds between messages
// Gelf forwarding settings
const GELF_URL = process.env.GELF_URL
// Local jsonlog echo
const ECHO_LOCAL = process.env.ECHO_LOCAL === 'true'
// Healthchecks.io
const HEALTHCHECKS_IO_URL = process.env.HEALTHCHECKS_IO_URL || undefined
const HEALTHCHECKS_IO_HEARTBEAT_MINS = process.env.HEALTHCHECKS_IO_HEARTBEAT_MINS || 5
module.exports = {
	Azure: {
		AzureConnectionString,
		QueueName,
		AzureFilter
	},
	Seq: {
		SEQ_URL,
        SEQ_API_KEY
	},
	Slack: {
		bot_token,
		rate_limit
	},
	Gelf: {
		url: GELF_URL
	},
	Local: {
		echo: ECHO_LOCAL
	},
	Healthchecksio: {
		url: HEALTHCHECKS_IO_URL,
		heartbeat: HEALTHCHECKS_IO_HEARTBEAT_MINS
	}
}
