# Gandelf

This is a Docker logs multiplexing container. It provides a Graylog Extended Log Format bridge for docker containers. It allows you to log to Seq, Slack, Azure Message queues, and AWS CloudWatch; while also logging locally via jsonlog.

Among other uses, this bad boy solves the issue described [here](https://github.com/moby/moby/issues/30887). When you are logging from your container to a 3rd-party logging provider - such as Logstash - you don't get any local logs for debugging. Why don't we have both? With Gandelf you can. You can use Gandelf as a logging middleware to log to local disk from multiple containers (with colors!) while still logging to remote 3rd party services.

Of course, in that scenario you need to note that Gandelf will become a single point of failure for your logging, so you probably want to add a heartbeat to it. [Healthchecks.io](https://healthchecks.io) support is included.

Check out [the GELF format here](http://docs.graylog.org/en/2.1/pages/gelf.html).

Read about how to [specify it for your docker containers here](https://docs.docker.com/engine/admin/logging/overview/#/gelf-options).

You could spin up a singleton instance and point your Docker containers at it, or you
could add it to a `docker-compose.yml` and deploy it alongside your container.

To log to Slack, set the `SLACK_API_TOKEN` environment variable with the [Slack Bot API token](https://api.slack.com/bot-users) for your Slack team.

To log to SEQ, set the `SEQ_URL` environment variable to point to your Seq instance.

You can also use this to forward logs to a remote GELF log server while retaining locally-accessible logs via the gandelf container's jsonlog.

See the included `docker-compose.yml` for an example configuration.

If you use it on the same machine as your other containers, and bring it up in the same `docker-compose` configuration, then you need to use `net: host` to get around the fact that the gelf driver needs to see the gelf endpoint before it starts containers. See [this issue](https://github.com/docker/compose/issues/2657) for more details on why that is.

Here's an example of a `docker-compose.yml` file that starts a "production" container, and logs to Slack, local JSON log (accessible via `docker logs gandelf`), and a remote Logstash server via GELF. Note that the gandelf container uses `network_mode: host` and the production container depends on the gandelf container.

```YAML
version: '2'
services:
 play:
  restart: always
  image: my-production-container
  container_name: production
  ports:
   - "80:80"
  logging:
   driver: gelf
   options:
    gelf-address: "udp://localhost:12201"
  depends_on:
   - "gandelf"
  links:
   - gandelf
 gandelf:
  restart: always
  image: sitapati/gandelf
  container_name: gandelf
  network_mode: host
  logging:
   driver: "json-file"
   options:
    max-size: "100k"
    max-file: "20"
  ports:
   - "12201:12201/udp"
  environment:
   - SLACK_API_TOKEN=xoxb-XXXXXXXXXXX-XXXXXXXXXXXXXX
   - GELF_URL=my-remote-logstash.com
   - LOCAL_ECHO=true
```
