import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as s3 from '@aws-cdk/aws-s3';
import * as deployment from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';

export class InventoryStack extends cdk.Stack {
    public inventoryTable: dynamodb.Table;
    public preflightHandler: lambda.Function;
    public listHandler: lambda.Function;
    public getHandler: lambda.Function;
    public createHandler: lambda.Function;
    public deleteHandler: lambda.Function;
    public restApi: apigw.RestApi;
    public siteBucket: s3.Bucket;
    public siteDeployment: deployment.BucketDeployment;
    public siteDistribution: cloudfront.CloudFrontWebDistribution;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.inventoryTable = new dynamodb.Table(this, 'InventoryTable', {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
        });

        const handlerCode = lambda.Code.fromAsset(
            path.join(__dirname, '../../backend/build')
        );

        this.preflightHandler = new lambda.Function(this, 'PreflightHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: handlerCode,
            handler: 'index.preflightHandler'
        });

        this.createHandler = new lambda.Function(this, 'CreateHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: handlerCode,
            handler: 'index.createHandler',
            environment: {
                INVENTORY_TABLE: this.inventoryTable.tableName
            }
        });
        this.inventoryTable.grantReadWriteData(this.createHandler);

        this.listHandler = new lambda.Function(this, 'ListHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: handlerCode,
            handler: 'index.listHandler',
            environment: {
                INVENTORY_TABLE: this.inventoryTable.tableName
            }
        });
        this.inventoryTable.grantReadData(this.listHandler);

        this.getHandler = new lambda.Function(this, 'GetHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: handlerCode,
            handler: 'index.getHandler',
            environment: {
                INVENTORY_TABLE: this.inventoryTable.tableName
            }
        });
        this.inventoryTable.grantReadData(this.getHandler);

        this.deleteHandler = new lambda.Function(this, 'DeleteHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: handlerCode,
            handler: 'index.deleteHandler',
            environment: {
                INVENTORY_TABLE: this.inventoryTable.tableName
            }
        });
        this.inventoryTable.grantReadWriteData(this.deleteHandler);

        this.restApi = new apigw.RestApi(this, 'RestApi', {
            restApiName: 'InventoryRestApi'
        });

        const collectionResource = this.restApi.root.addResource('inventory');
        collectionResource.addMethod(
            'OPTIONS',
            new apigw.LambdaIntegration(this.preflightHandler)
        );
        collectionResource.addMethod(
            'POST',
            new apigw.LambdaIntegration(this.createHandler)
        );
        collectionResource.addMethod(
            'GET',
            new apigw.LambdaIntegration(this.listHandler)
        );

        const memberResource = collectionResource.addResource('{id}');
        memberResource.addMethod(
            'OPTIONS',
            new apigw.LambdaIntegration(this.preflightHandler)
        );
        memberResource.addMethod(
            'GET',
            new apigw.LambdaIntegration(this.getHandler)
        );
        memberResource.addMethod(
            'DELETE',
            new apigw.LambdaIntegration(this.deleteHandler)
        );

        this.siteBucket = new s3.Bucket(this, 'SiteBucket', {
            publicReadAccess: true,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'error.html'
        });

        this.siteDeployment = new deployment.BucketDeployment(
            this,
            'SiteDeployment',
            {
                sources: [
                    deployment.Source.asset(
                        path.join(__dirname, '../../frontend/build')
                    )
                ],
                destinationBucket: this.siteBucket
            }
        );

        this.siteDistribution = new cloudfront.CloudFrontWebDistribution(
            this,
            'SiteDistribution',
            {
                originConfigs: [
                    {
                        s3OriginSource: {
                            s3BucketSource: this.siteBucket
                        },
                        behaviors: [
                            // cache all assets as long as possible
                            {
                                isDefaultBehavior: true,
                                defaultTtl: cdk.Duration.days(365),
                                maxTtl: cdk.Duration.days(365)
                            },
                            // but don't cache HTML files
                            {
                                pathPattern: '*.html',
                                defaultTtl: cdk.Duration.seconds(0),
                                maxTtl: cdk.Duration.seconds(0)
                            }
                        ]
                    }
                ]
            }
        );
    }
}
