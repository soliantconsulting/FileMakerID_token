#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { FileMakerID_API } from '../lib/FileMakerID_API';

const app = new cdk.App();
new FileMakerID_API(app, 'FileMakerIDAPIStack');

app.synth();