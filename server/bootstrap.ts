import { Strapi } from '@strapi/strapi';

type Webview = {
  id: string;
  title: string;
  icon: string;
};

export default ({ strapi }: { strapi: Strapi }) => {
  // bootstrap phase
  async function registerPermissionActions() {
    const webviews = await strapi?.entityService?.findMany('plugin::webviews.webview', {
      fields: ['id', 'title', 'icon'],
    });

    const transformIndexToLetterCase = (index: number) => {
      const letters = 'abcdefghijklmnopqrstuvwxyz';
      return letters[index % letters.length] + letters[Math.floor(index / letters.length) % letters.length];
    };

    const actions = [
      ...webviews?.map((webview: Webview, index: number) => ({
        section: 'plugins',
        displayName: webview.title,
        uid: `read.${webview.title.toLowerCase().replace(/\s+/g, '-')}-${transformIndexToLetterCase(index)}`,
        pluginName: 'webviews',
        subCategory: 'webviews',
      })) ?? [],
      {
        section: 'plugins',
        displayName: 'Manage webviews',
        uid: 'manage',
        pluginName: 'webviews',
      },
    ];

    await strapi.admin?.services.permission.actionProvider.registerMany(actions);
  };

  registerPermissionActions();
};
