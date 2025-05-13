import type { NestApplicationOptions } from '@nestjs/common';

import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

async function readAppHttpsOptions(
  keyPath: string = './secrets/private-key.pem',
  certPath: string = './secrets/public-certificate.pem',
): Promise<NestApplicationOptions['httpsOptions']> {
  try {
    const keyPathResolved = resolve(keyPath);
    const certPathResolved = resolve(certPath);
    if (!existsSync(keyPathResolved)) {
      throw new Error(`>>> HTTPS: Key file not found: ${keyPathResolved}`);
    }
    if (!existsSync(certPathResolved)) {
      throw new Error(`>>> HTTPS: Cert file not found: ${certPathResolved}`);
    }
    const [key, cert] = await Promise.all([
      fs.readFile(keyPathResolved),
      fs.readFile(certPathResolved),
    ]);
    return { key, cert } as NonNullable<NestApplicationOptions['httpsOptions']>;
  } catch (error) {
    const message = (error instanceof Error ? error.message : error) as string;
    console.error('>>> Unable to get HTTPS options:', message);
    return;
  }
}

export async function createAppOptions(): Promise<NestApplicationOptions> {
  const appOptions: NestApplicationOptions = {};
  try {
    appOptions.cors = {
      origin: process.env.CORS_ALLOWED_ORIGINS?.split(','),
    };
    if (process.env.ENABLE_HTTPS === 'true') {
      const httpsOptions = await readAppHttpsOptions();
      if (httpsOptions) appOptions.httpsOptions = httpsOptions;
    }
  } catch (error) {
    const message = (error instanceof Error ? error.message : error) as string;
    console.error('>>> Error creating Application Options:', message);
  }
  return appOptions;
}
