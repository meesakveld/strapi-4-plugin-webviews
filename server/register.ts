import { Strapi } from '@strapi/strapi';
import cspDynamic from './middlewares/csp-dynamic';

export default ({ strapi }: { strapi: Strapi }) => {
  // register phase
  strapi.server.use(cspDynamic);
};
