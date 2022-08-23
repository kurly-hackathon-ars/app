import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest(async (env) => ({
  name: '__MSG_APP_NAME__',
  description: '__MSG_APP_DESCRIPTION__',
  version: '0.0.0',
  default_locale: 'ko',
  manifest_version: 3,
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-34.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
  },
  options_page: 'options.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      run_at: 'document_end',
      matches: ['https://www.kurly.com/*'],
      js: [
        ...(env.mode === 'development' ? [] : ['public/js/webcomponent.js']),
        'src/content/index.ts',
      ],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['img/logo-16.png', 'img/logo-34.png', 'img/logo-48.png', 'img/logo-128.png'],
      matches: ['<all_urls>'],
    },
  ],
  permissions: ['webRequest', 'storage'],
  host_permissions: ['<all_urls>'],
}))
