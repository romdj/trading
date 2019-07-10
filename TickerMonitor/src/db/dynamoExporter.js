AWS.config.apiVersions = {
    dynamodb: '2012-08-10',
    // other service API versions
};

const dynamodb = new AWS.DynamoDB();

