---
id: mongodb
title: Using with MongoDB
---

With the [Global Setup/Teardown](Configuration.md#globalsetup-string) and [Async Test Environment](Configuration.md#testenvironment-string) APIs, elric can work smoothly with [MongoDB](https://www.mongodb.com/).

## Use elric-mongodb Preset

[elric MongoDB](https://github.com/shelfio/elric-mongodb) provides all required configuration to run your tests using MongoDB.

1.  First install `@shelf/elric-mongodb`

```
yarn add @shelf/elric-mongodb --dev
```

2.  Specify preset in your elric configuration:

```json
{
  "preset": "@shelf/elric-mongodb"
}
```

3.  Write your test

```js
const {MongoClient} = require('mongodb');

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection('users');

    const mockUser = {_id: 'some-user-id', name: 'John'};
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({_id: 'some-user-id'});
    expect(insertedUser).toEqual(mockUser);
  });
});
```

There's no need to load any dependencies.

See [documentation](https://github.com/shelfio/elric-mongodb) for details (configuring MongoDB version, etc).
