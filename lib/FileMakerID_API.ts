import * as cdk from '@aws-cdk/core';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';

export class FileMakerID_API extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handlerFn = new lambda.NodejsFunction(this, 'apihandler', {
      bundling: {
        externalModules: [''],
        nodeModules: ['express', 'buffer', 'pug', 'node-fetch'],
        commandHooks: {
          beforeInstall(inputDir: string, outputDir: string): string[] { return ['true'] },
          beforeBundling(inputDir: string, outputDir: string): string[] { return ['true'] },
          // Copy pug templates into the bundled asset. It would be
          // a little nicer to precompile these with a custom loader
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [`cp -R ${inputDir}/views ${outputDir}`];
          },
        }
      },
      timeout: cdk.Duration.seconds(30), // api gateway max time is 29seconds
    });
    const lambdaIntegration = new LambdaProxyIntegration({
      handler: handlerFn,
    });

    const api = new HttpApi(this, 'HttpApi', {
      defaultIntegration: lambdaIntegration,
      corsPreflight: {
        allowHeaders: ['Authorization'],
        allowMethods: [HttpMethod.GET, HttpMethod.HEAD, HttpMethod.OPTIONS, HttpMethod.POST],
        allowOrigins: ['*'],
        maxAge: cdk.Duration.days(10),
      },
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', { value: api.apiEndpoint })

  }
}
