
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'inventory-producer',
  brokers: ['localhost:9092'],
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
