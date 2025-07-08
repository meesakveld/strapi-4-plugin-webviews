import { prefixPluginTranslations } from "@strapi/helper-plugin";

import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import { auth } from "@strapi/helper-plugin";
import * as icons from "@strapi/icons";

const name = pluginPkg.strapi.name;

export default {
  async register(app: any) {

    // Haal webviews op via API
    let webviews = [];
    try {
      const res = await fetch(`/webviews/tabs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getToken()}`,
        },
      });
      const data = await res.json();

      if (!res.ok) return;
      if (typeof data !== "object" || !Array.isArray(data)) return;

      webviews = data
    } catch (err) {
      console.error("Failed to fetch webviews:", err);
    }

    // Dynamisch extra webview-menu's
    webviews.forEach(async (webview: any, index: number) => {
      const transformIndexToLetterCase = (index: number) => {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        return letters[index % letters.length] + letters[Math.floor(index / letters.length) % letters.length];
      };

      const permissionsAction = `plugin::webviews.read.${webview.title.toLowerCase().replace(/\s+/g, '-')}-${transformIndexToLetterCase(index)}`;

      app.addMenuLink({
        to: `/plugins/${pluginId}/${webview.id}`,
        icon: icons[webview.icon],
        intlLabel: {
          id: `${pluginId}.webview.${webview.id}`,
          defaultMessage: webview.title,
        },
        Component: async () => {
          const component = await import("./pages/WebviewPage");
          return component;
        },
        permissions: [
          {
            action: permissionsAction,
            subject: null,
          },
        ],
      });
    });

    // Pluginregistratie
    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: true,
      name,
    };

    app.registerPlugin(plugin);
  },

  bootstrap(app: any) {
    app.addSettingsLink("global", {
      intlLabel: {
        id: `webviews.plugin.name`,
        defaultMessage: "Webviews",
      },
      id: "webviews-settings-link",
      to: `/settings/${pluginId}`,
      Component: async () => {
        const component = await import("./pages/SettingsPage");
        return component;
      },
      permissions: [
        {
          action: 'plugin::webviews.manage',
          subject: null,
        },
      ],
    });
  },

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      locales.map((locale: string) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => ({
            data: prefixPluginTranslations(data, pluginId),
            locale,
          }))
          .catch(() => ({ data: {}, locale }));
      })
    );

    return Promise.resolve(importedTrads);
  },
};
