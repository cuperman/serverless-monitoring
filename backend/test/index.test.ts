import {
    APIGatewayProxyEvent,
    APIGatewayEventRequestContext
} from 'aws-lambda';
import * as index from '../index';

function mockContext(overrides: any = {}) {
    const defaults: APIGatewayEventRequestContext = {
        accountId: '',
        apiId: '',
        httpMethod: '',
        identity: {
            accessKey: '',
            accountId: '',
            apiKey: '',
            apiKeyId: '',
            caller: '',
            cognitoAuthenticationProvider: '',
            cognitoAuthenticationType: '',
            cognitoIdentityId: '',
            cognitoIdentityPoolId: '',
            principalOrgId: '',
            sourceIp: '',
            user: '',
            userAgent: '',
            userArn: ''
        },
        path: '',
        stage: '',
        requestId: '',
        requestTimeEpoch: 0,
        resourceId: '',
        resourcePath: ''
    };
    return Object.assign({}, defaults, overrides);
}

function mockEvent(overrides: any = {}) {
    const defaults: APIGatewayProxyEvent = {
        body: '',
        headers: {},
        multiValueHeaders: {},
        httpMethod: 'GET',
        isBase64Encoded: false,
        path: '/',
        pathParameters: {},
        queryStringParameters: {},
        multiValueQueryStringParameters: {},
        stageVariables: {},
        requestContext: mockContext(overrides.requestContext || {}),
        resource: ''
    };
    return Object.assign({}, defaults, overrides);
}

describe('index.getHandler', () => {
    it('returns status code 200', async () => {
        const result = await index.getHandler(mockEvent());
        expect(result.statusCode).toEqual(200);
    });

    it('returns event data', async () => {
        const result = await index.getHandler(
            mockEvent({
                path: '/foo/bar'
            })
        );
        const body = JSON.parse(result.body);
        expect(body.event.path).toEqual('/foo/bar');
    });
});
