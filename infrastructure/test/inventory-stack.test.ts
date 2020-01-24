import {
    expect as expectCDK,
    matchTemplate,
    MatchStyle
} from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { InventoryStack } from '../lib/inventory-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new InventoryStack(app, 'TestInventoryStack');
    // THEN
    expectCDK(stack).to(
        matchTemplate(
            {
                Resources: {}
            },
            MatchStyle.EXACT
        )
    );
});
