#!/usr/bin/env ts-node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InventoryStack } from '../lib/inventory-stack';

const app = new cdk.App();
new InventoryStack(app, 'InventoryStack');
