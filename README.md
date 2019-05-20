Dreamhouse Kafka Postgres
-------------------------


[![Build Status](https://dev.azure.com/SrikanthReddyAnnadi1/SrikanthReddyAnnadi1/_apis/build/status/srikanthannadi.dreamhouse-kafka-postgres?branchName=master)](https://dev.azure.com/SrikanthReddyAnnadi1/SrikanthReddyAnnadi1/_build/latest?definitionId=1&branchName=master)

Consumes events from Kafka and inserts them into Postgres.

Run on Heroku:

1. [Follow the instructions to deploy the Dreamhouse Web App (Kafka Branch) on Heroku](https://github.com/dreamhouseapp/dreamhouse-web-app/tree/kafka)
1. [![Deploy on Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
1. Attach the Dreamhouse Web App's Kafka to this app:

        # Get the Kafka Addon ID (e.g. kafka-something-12345)
        heroku addons:info heroku-kafka -a DREAMHOUSE_WEB_APP_HEROKU_APP_NAME

        # Attach the addon to the newly deployed app
        heroku addons:attach KAFKA_ADDON_ID -a DREAMHOUSE_KAFKA_POSTGRES_HEROKU_APP_NAME

1. View some properties in your Dreamhouse Web App
1. Check that the view events were consumed and then added to Postgres:

        heroku pg:psql -c "SELECT * FROM interactions" -a DREAMHOUSE_KAFKA_POSTGRES_HEROKU_APP_NAME

Run Locally:

1. [Install Node.js](https://nodejs.org/en/)
1. Fetch the NPM dependencies: `npm install`
1. Get the Kafka environment variables from a Heroku app:

        heroku config -s -a DREAMHOUSE_KAFKA_POSTGRES_HEROKU_APP_NAME > .env
        set -o allexport
        source .env
        set +o allexport

1. Start the app: `npm run dev`
