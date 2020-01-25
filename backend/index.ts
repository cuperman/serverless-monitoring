import * as AWS from 'aws-sdk';
import * as uuid from 'uuid/v4';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const INVENTORY_TABLE = process.env.INVENTORY_TABLE || '';

const documentClient = new AWS.DynamoDB.DocumentClient();

export async function listHandler(): Promise<APIGatewayProxyResult> {
    const output = await documentClient
        .scan({
            TableName: INVENTORY_TABLE
        })
        .promise();

    const response = output.Items || [];

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(response)
        };
    }

    return {
        statusCode: 404,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify('')
    };
}

export async function createHandler(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    const id = uuid();

    const attributes = JSON.parse(event.body || '{}');

    await documentClient
        .put({
            TableName: INVENTORY_TABLE,
            Item: Object.assign({}, attributes, { id })
        })
        .promise();

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify('')
    };
}
