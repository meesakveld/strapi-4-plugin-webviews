import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async find(ctx) {
    const { query } = ctx;
    const webviews = await strapi.entityService?.findMany('plugin::webviews.webview', {
      ...query,
    });

    ctx.body = webviews;
  },
  async findOne(ctx) {
    const { id } = ctx.params;
    const webview = await strapi.entityService?.findOne('plugin::webviews.webview', parseInt(id));
    if (!webview) {
      return ctx.notFound('Webview not found');
    }
    ctx.body = webview;
  },
  async create(ctx) {
    const { body } = ctx.request;

    const createdWebview = await strapi.entityService?.create('plugin::webviews.webview', {
      data: {
        title: body.data.title,
        url: body.data.url,
        icon: body.data.icon,
      },
    });

    if (!createdWebview) {
      return ctx.badRequest('Failed to create webview');
    }

    ctx.body = createdWebview;
    ctx.status = 201;
  },
  async update(ctx) {
    const { id } = ctx.params;
    const { body } = ctx.request;

    const updatedWebview = await strapi.entityService?.update(
      'plugin::webviews.webview',
      parseInt(id),
      { data: body.data as any }
    );
    if (!updatedWebview) {
      return ctx.notFound('Webview not found');
    }
    ctx.body = updatedWebview;
    ctx.status = 200;
  },
  async delete(ctx) {
    const { id } = ctx.params;
    const deletedWebview = await strapi.entityService?.delete('plugin::webviews.webview', parseInt(id));

    if (!deletedWebview) {
      return ctx.notFound('Webview not found');
    }

    ctx.status = 204; // No Content
    ctx.body = null;
  },
  async tabs(ctx) { // !! BE AWARE: No authentication for this endpoint !!
    // return title and id
    const webviews = await strapi.entityService?.findMany('plugin::webviews.webview', {
      fields: ['id', 'title', 'icon'],
      limit: -1,
    });
    if (!webviews) {
      return ctx.notFound('No webviews found');
    }
    ctx.body = webviews.map((webview) => ({
      id: webview.id,
      title: webview.title,
      icon: webview.icon
    }));
    ctx.status = 200;
  }
});
