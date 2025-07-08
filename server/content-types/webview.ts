import * as Icons from '@strapi/icons';

const iconOptions = Object.keys(Icons).sort();

export default {
    kind: 'collectionType',
    collectionName: 'content-type',
    info: {
        singularName: 'webview', // kebab-case mandatory
        pluralName: 'webviews', // kebab-case mandatory
        displayName: 'Webview',
        description: 'A collection of webviews with titles and URLs',
    },
    options: {
        draftAndPublish: false,
    },
    pluginOptions: {
        'content-manager': {
            visible: false,
        },
        'content-type-builder': {
            visible: false,
        }
    },
    attributes: {
        title: {
            type: 'string',
            min: 1,
            max: 25,
            configurable: false,
        },
        url: {
            type: 'string',
            min: 1,
            max: 200,
            configurable: false,
        },
        icon: {
            type: 'enumeration',
            enum: iconOptions,
            configurable: false,
            default: iconOptions[0], // Default to the first icon in the list
        },
    }
};