
const { Kafka } = require('kafkajs');
const db = require('../db');
const { processSale } = require('../fifo');

const kafka = new Kafka({
  clientId: 'inventory-consumer',
  brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['127.0.0.1:9092'],
  ssl: !!process.env.KAFKA_SSL,
  sasl: process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD ? {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  } : undefined,
});

const consumer = kafka.consumer({ groupId: 'inventory-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'inventory-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      const { product_id, event_type, quantity, unit_price, timestamp } = event;

      if (event_type === 'purchase') {
        await db.query(
          'INSERT INTO inventory_batches (product_id, quantity, unit_price, timestamp) VALUES ($1, $2, $3, $4)',
          [product_id, quantity, unit_price, timestamp]
        );
      } else if (event_type === 'sale') {
        await processSale(product_id, quantity);
      }
    }
  });

  console.log('Kafka consumer running...');
};

run().catch(console.error);
