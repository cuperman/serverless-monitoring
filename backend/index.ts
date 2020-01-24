import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function handler(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    return {
        statusCode: 200,
        headers: {},
        body: JSON.stringify({ event })
    };
}
