import * as AWSXRay from 'aws-xray-sdk';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid/v4';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const INVENTORY_TABLE = process.env.INVENTORY_TABLE || '';

const documentClient = new AWS.DynamoDB.DocumentClient();

// FIXME: DocumentClient does not expose service attribute
//   https://github.com/aws/aws-sdk-js/issues/1846
AWSXRay.captureAWSClient((documentClient as any).service);

function responseHeaders(headers: { [name: string]: string } = {}) {
    const defaultHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    return Object.assign({}, defaultHeaders, headers);
}

export async function preflightHandler(): Promise<APIGatewayProxyResult> {
    return {
        statusCode: 200,
        headers: responseHeaders({
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type'
        }),
        body: JSON.stringify('')
    };
}

export async function listHandler(): Promise<APIGatewayProxyResult> {
    const output = await documentClient
        .scan({
            TableName: INVENTORY_TABLE
        })
        .promise();

    const response = output.Items || [];

    return {
        statusCode: 200,
        headers: responseHeaders(),
        body: JSON.stringify(response)
    };
}

export async function getHandler(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    const pathParams = event.pathParameters || {};
    const id = pathParams.id;

    const output = await documentClient
        .get({
            TableName: INVENTORY_TABLE,
            Key: {
                id
            }
        })
        .promise();

    if (output.Item) {
        const response = output.Item;

        return {
            statusCode: 200,
            headers: responseHeaders(),
            body: JSON.stringify(response)
        };
    }

    return {
        statusCode: 404,
        headers: responseHeaders(),
        body: JSON.stringify('')
    };
}

function jsonify(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
}

function dynamoify(obj: any): any {
    return Object.entries(jsonify(obj)).reduce((accum: any, [key, value]) => {
        if (value === '') {
            accum[key] = null;
        } else {
            accum[key] = value;
        }
        return accum;
    }, {});
}

export async function createHandler(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    const id = uuid();

    const attributes = JSON.parse(event.body || '{}');

    await documentClient
        .put({
            TableName: INVENTORY_TABLE,
            Item: dynamoify(Object.assign({}, attributes, { id }))
        })
        .promise();

    return {
        statusCode: 200,
        headers: responseHeaders(),
        body: JSON.stringify({ id })
    };
}

export async function deleteHandler(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    const pathParams = event.pathParameters || {};
    const id = pathParams.id;

    await documentClient
        .delete({
            TableName: INVENTORY_TABLE,
            Key: {
                id
            }
        })
        .promise();

    return {
        statusCode: 200,
        headers: responseHeaders(),
        body: JSON.stringify('')
    };
}
