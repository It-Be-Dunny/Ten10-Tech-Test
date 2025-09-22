import { config as dotenvConfig } from 'dotenv';
import { IConfig } from './types';

dotenvConfig({ quiet: true });

const loginEmail = process.env.LOGIN_EMAIL;
const loginPassword = process.env.LOGIN_PASSWORD;
const baseURL = process.env.BASE_URL

if (!baseURL) throw new Error('BASE_URL is required');
if (!loginEmail) throw new Error('LOGIN_EMAIL is required');
if (!loginPassword) throw new Error('LOGIN_PASSWORD is required');

export const config: IConfig = {
  loginEmail,
  loginPassword
};
