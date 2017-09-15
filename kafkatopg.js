var pg = require('pg');
var Kafka = require('no-kafka');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/dreamhouse';

if (process.env.DATABASE_URL !== undefined) {
  pg.defaults.ssl = true;
}

var client = new pg.Client(connectionString);
client.connect();

client.query('SELECT * FROM interactions LIMIT 1', function(error) {
  if (error !== null) {
    client.query('CREATE TABLE interactions (id SERIAL NOT NULL, userId CHARACTER VARYING(64), propertyId CHARACTER VARYING(64), eventType CHARACTER VARYING(64), date TIMESTAMP)');
  }
});

var consumer = new Kafka.SimpleConsumer();

var kafkaPrefix = process.env.KAFKA_PREFIX;
if (kafkaPrefix === undefined) {
  kafkaPrefix = '';
}

consumer.init().then(function() {
  return consumer.subscribe(kafkaPrefix + 'interactions', [0], function(messageSet, topic, partition) {
    messageSet.forEach(function(m) {
      var data = JSON.parse(m.message.value.toString('utf8'));
      client.query('INSERT INTO interactions(userId, propertyId, eventType, date) VALUES($1, $2, $3, to_timestamp($4))', [data.userId, data.propertyId, data.eventType, Math.floor(data.date / 1000)]);
    });
  });
});
