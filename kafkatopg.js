var pg = require('pg');
var Kafka = require('no-kafka');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/dreamhouse';

if (process.env.DATABASE_URL !== undefined) {
  pg.defaults.ssl = true;
}

var client = new pg.Client(connectionString);
client.connect();

client.query('SELECT * FROM interactions LIMIT 1', function(error, data) {
  if (error !== null) {
    client.query('CREATE TABLE interactions (id SERIAL NOT NULL, path CHARACTER VARYING(512))');
  }
});


var brokerUrls = process.env.KAFKA_URL.replace(/\+ssl/g,'');

var consumer = new Kafka.SimpleConsumer({
  connectionString: brokerUrls,
  ssl: {
    certFile: './client.crt',
    keyFile: './client.key'
  }
});

consumer.init().then(function() {
  return consumer.subscribe('interactions', [0], function(messageSet, topic, partition) {
    messageSet.forEach(function(m) {
      var data = JSON.parse(m.message.value.toString('utf8'));
      client.query('INSERT INTO interactions(path) VALUES($1)', [data.path]);
    });
  });
});
