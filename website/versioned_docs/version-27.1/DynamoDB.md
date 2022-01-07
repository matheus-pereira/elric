---
id: dynamodb
title: Using with DynamoDB
---

With the [Global Setup/Teardown](Configuration.md#globalsetup-string) and [Async Test Environment](Configuration.md#testenvironment-string) APIs, elric can work smoothly with [DynamoDB](https://aws.amazon.com/dynamodb/).

## Use elric-dynamodb Preset

[elric DynamoDB](https://github.com/shelfio/elric-dynamodb) provides all required configuration to run your tests using DynamoDB.

1.  First, install `@shelf/elric-dynamodb`

```
yarn add @shelf/elric-dynamodb --dev
```

2.  Specify preset in your elric configuration:

```json
{
  "preset": "@shelf/elric-dynamodb"
}
```

3.  Create `elric-dynamodb-config.js` and define DynamoDB tables

See [Create Table API](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property)

```js
module.exports = {
  tables: [
    {
      TableName: `files`,
      KeySchema: [{AttributeName: 'id', KeyType: 'HASH'}],
      AttributeDefinitions: [{AttributeName: 'id', AttributeType: 'S'}],
      ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
    },
    // etc
  ],
};
```

4.  Configure DynamoDB client

```js
const {DocumentClient} = require('aws-sdk/clients/dynamodb');

const isTest = process.env.elric_WORKER_ID;
const config = {
  convertEmptyValues: true,
  ...(isTest && {
    endpoint: 'localhost:8000',
    sslEnabled: false,
    region: 'local-env',
  }),
};

const ddb = new DocumentClient(config);
```

5.  Write tests

```js
it('should insert item into table', async () => {
  await ddb
    .put({TableName: 'files', Item: {id: '1', hello: 'world'}})
    .promise();

  const {Item} = await ddb.get({TableName: 'files', Key: {id: '1'}}).promise();

  expect(Item).toEqual({
    id: '1',
    hello: 'world',
  });
});
```

There's no need to load any dependencies.

See [documentation](https://github.com/shelfio/elric-dynamodb) for details.
