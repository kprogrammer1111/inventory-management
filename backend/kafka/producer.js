
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'inventory-producer',
  brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['127.0.0.1:9092'],
  ssl: !!process.env.KAFKA_SSL,
  sasl: process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD ? {
    mechanism: process.env.KAFKA_SASL_MECHANISM || 'plain',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  } : undefined,
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  const messages = [
    { value: JSON.stringify({ product_id: "PRD001", event_type: "purchase", quantity: 100, unit_price: 10, timestamp: new Date().toISOString() }) },
    { value: JSON.stringify({ product_id: "PRD001", event_type: "sale", quantity: 20, timestamp: new Date().toISOString() }) },
  ];
  await producer.send({ topic: 'inventory-events', messages });
  console.log("Messages sent");
  await producer.disconnect();
};

run();
