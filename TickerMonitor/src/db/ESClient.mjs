import elasticsearch from 'elasticsearch';
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

client.bulk({
  body: [
    // action description
    { index:  { _index: 'myindex', _type: 'mytype', _id: 1 } },
     // the document to index
    { title: 'foo' },
    // action description
    { update: { _index: 'myindex', _type: 'mytype', _id: 2 } },
    // the document to update
    { doc: { title: 'foo' } },
    // action description
    { delete: { _index: 'myindex', _type: 'mytype', _id: 3 } },
    // no document needed for this delete
  ]
}, function (err, resp) {
  // ...
});


// Adds a typed JSON document in a specific index, making it searchable. If a document with the same index, type, and id already exists, an error will occur.
// Check the API Conventions and the elasticsearch docs for more information pertaining to this method.
// Create a document. 

client.create([params, [callback]])

await client.create({
  index: 'myindex',
  type: 'mytype',
  id: '1',
  body: {
    title: 'Test 1',
    tags: ['y', 'z'],
    published: true,
    published_at: '2013-01-01',
    counter: 1
  }
});

export function ping() {
  client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
  }, function (error) {
    if (error) {
      console.trace('elasticsearch cluster is down!');
    } else {
      console.log('All is well');
    }
  });
}

export function fetch(key, value) {
  try {
    const response = await client.search({
      q: 'pants'
    });
    console.log(response.hits.hits)
  } catch (error) {
    console.trace(error.message)
  }
}

export function search(key, value) {
  const response = await client.search({
    index: 'twitter',
    type: 'tweets',
    body: {
      query: {
        match: {
          body: 'elasticsearch'
        }
      }
    }
  })
}

for (const tweet of response.hits.hits) {
  console.log('tweet:', tweet);
}