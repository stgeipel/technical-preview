import * as dotenv from 'dotenv'
dotenv.config()
export const Config = {
  port: parseInt(process.env.PORT || '8080'),
}
