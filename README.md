# Gandelf

This is a Gray Extended Log Format to Slack bridge.

Check out [the GELF format here](http://docs.graylog.org/en/2.1/pages/gelf.html).

Read about how to [specify it for your docker containers here](https://docs.docker.com/engine/admin/logging/overview/#/gelf-options).

You could spin up a singleton instance and point your Docker containers at it, or you 
could add it to a `docker-compose.yml` and deploy it alongside your container.

You want to set the `SLACK_API_TOKEN` environment variable with the (Slack Bot API token)[https://api.slack.com/bot-users] for your Slack team.