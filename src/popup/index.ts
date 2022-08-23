import { html, css, LitElement, unsafeCSS, TemplateResult } from 'lit'
import { customElement, eventOptions, property } from 'lit/decorators.js'

import tailwind from '../styles/tailwind.css?inline'

import { IconCog, IconEdit, IconMinus, IconPlus } from '../content/components/icons/icons'
import '../content/components/modal/modal'
import { watch } from '../content/utils/watch'

@customElement('popup-main')
export class PopupMain extends LitElement {
  static styles = [
    unsafeCSS(tailwind),
    css`
      main {
        min-width: 500px;
        padding: 1rem;
      }

      .outline-none-important {
        outline: none !important;
      }
    `,
  ]

  // # Properties

  @property({ type: Boolean })
  categoryModalOpen = false

  @property({ type: String })
  categoryModalMode: `EDIT` | `CREATE` = `CREATE`

  @property({ type: Boolean })
  showUserWindow = true

  @property({ type: Boolean })
  showRecentProductWindow = true

  @property({ type: Boolean })
  showPickedItemsWindow = true

  @property({ type: Boolean })
  showCartItemsWindow = true

  @property({ type: Boolean })
  enableSearchAPI = true

  @property({ type: String })
  apiName = ``

  @property({ type: String })
  apiDescription = ``

  @property({ type: String })
  apiPath = ``

  @property({ type: Array })
  customApis: API[] = []

  @property({ type: Array })
  showCustomWindows: boolean[] = []

  private customApiIndex: number | null = null

  // # Event handlers

  @eventOptions({})
  onClickDeleteCategory(index: number, event: Event): void {
    event.stopImmediatePropagation()
    let customApis = this.customApis
    customApis = [...customApis.slice(0, index), ...customApis.slice(index + 1)]
    chrome.storage.local.set({ customApis: customApis })
    this.customApis = customApis

    chrome.storage.local.get(['reload'], (result: any) => {
      const reload = result.reload
      chrome.storage.local.set({ reload: !reload })
    })
  }

  @eventOptions({})
  onClickEditCategory(api: API, index: number, event: Event): void {
    event.stopImmediatePropagation()
    this.apiName = api.name
    this.apiDescription = api.description
    this.apiPath = api.path

    this.customApiIndex = index
    this.categoryModalMode = `EDIT`
    this.categoryModalOpen = true
  }

  @eventOptions({})
  onClickOpenCategoryModal(): void {
    this.apiName = ``
    this.apiPath = ``
    this.apiDescription = ``
    this.customApiIndex = null
    this.categoryModalMode = `CREATE`
    this.categoryModalOpen = true
  }

  @eventOptions({})
  onClickCloseCategoryModal(): void {
    this.categoryModalOpen = false
  }

  @eventOptions({})
  onClickAddCategory(): void {
    this.onClickCloseCategoryModal()
  }

  @eventOptions({})
  onClickCreateApi(): void {
    chrome.storage.local.get(['customApis'], async (result: any) => {
      let customApis: API[] = result.customApis || []

      if (customApis.findIndex((api) => api.path === this.apiPath) !== -1) {
        alert(chrome.i18n.getMessage('ALREADY_EXISTS_API'))
        return
      }

      customApis = [
        ...customApis,
        {
          name: this.apiName,
          description: this.apiDescription,
          path: this.apiPath,
        },
      ]

      chrome.storage.local.set({ customApis: customApis })
      this.customApis = customApis

      chrome.storage.local.get(['reload'], (result: any) => {
        const reload = result.reload
        chrome.storage.local.set({ reload: !reload })
      })
    })
  }

  @eventOptions({})
  onClickEditApi(): void {
    chrome.storage.local.get(['customApis'], async (result: any) => {
      let customApis: API[] = result.customApis
      if (this.customApiIndex === null) return

      customApis = customApis.map((item, index) => {
        if (index !== this.customApiIndex) {
          return item
        }

        return {
          ...item,
          ...{
            name: this.apiName,
            description: this.apiDescription,
            path: this.apiPath,
          },
        }
      })

      chrome.storage.local.set({ customApis: customApis })
      this.customApis = customApis

      chrome.storage.local.get(['reload'], (result: any) => {
        const reload = result.reload
        chrome.storage.local.set({ reload: !reload })
      })
    })
  }

  // # Lifecycle methods

  constructor() {
    super()
    chrome.storage.local.get(
      [
        `showUserWindow`,
        `showRecentProductWindow`,
        `showPickedItemsWindow`,
        `showCartItemsWindow`,
        `enableSearchAPI`,
        `customApis`,
        `showCustomWindows`,
      ],
      (result: any) => {
        const {
          showUserWindow,
          showRecentProductWindow,
          showPickedItemsWindow,
          showCartItemsWindow,
          enableSearchAPI,
          customApis,
          showCustomWindows,
        } = result
        this.showUserWindow = showUserWindow
        this.showRecentProductWindow = showRecentProductWindow
        this.showPickedItemsWindow = showPickedItemsWindow
        this.showCartItemsWindow = showCartItemsWindow
        this.enableSearchAPI = enableSearchAPI
        this.customApis = customApis || []

        this.showCustomWindows = showCustomWindows || []
      },
    )
  }

  // # watch

  @watch('showUserWindow', { waitUntilFirstUpdate: true })
  async onWatchshowUserWindow(): Promise<void> {
    chrome.storage.local.set({ showUserWindow: this.showUserWindow })
  }

  @watch('showRecentProductWindow', { waitUntilFirstUpdate: true })
  async onWatchshowRecentProductWindow(): Promise<void> {
    chrome.storage.local.set({ showRecentProductWindow: this.showRecentProductWindow })
  }

  @watch('showPickedItemsWindow', { waitUntilFirstUpdate: true })
  async onWatchshowPickedItemsWindow(): Promise<void> {
    chrome.storage.local.set({ showPickedItemsWindow: this.showPickedItemsWindow })
  }

  @watch('showCartItemsWindow', { waitUntilFirstUpdate: true })
  async onWatchshowCartItemsWindow(): Promise<void> {
    chrome.storage.local.set({ showCartItemsWindow: this.showCartItemsWindow })
  }

  @watch('enableSearchAPI', { waitUntilFirstUpdate: true })
  async onWatchenableSearchAPI(): Promise<void> {
    chrome.storage.local.set({ enableSearchAPI: this.enableSearchAPI })
  }

  @watch('showCustomWindows', { waitUntilFirstUpdate: true })
  async onWatchshowCustomWindows(): Promise<void> {
    chrome.storage.local.set({ showCustomWindows: this.showCustomWindows })
  }

  renderCustomApiMenus(): TemplateResult[] {
    return this.customApis.map((api, index) => {
      return html`
        <li class="w-full flex">
          <ul class="text-gray-400 p-0 mt-[-0.25rem]">
            <li class="mb-1">
              <button
                class="btn btn-xs btn-circle btn-outline p-0"
                @click=${this.onClickEditCategory.bind(this, api, index)}
              >
                ${IconEdit}
              </button>
            </li>
            <li>
              <button
                class="btn btn-xs btn-circle btn-outline p-0"
                @click=${this.onClickDeleteCategory.bind(this, index)}
              >
                ${IconMinus}
              </button>
            </li>
          </ul>
          <div class="tooltip py-0" data-tip="${api.description}">
            <label class="label cursor-pointer">
              <span class="flex items-center">
                <span class="label-text">${api.name}</span>
              </span>
              <span>
                <input
                  data-path="${api.path}"
                  type="checkbox"
                  class="toggle toggle-accent"
                  ?checked=${this.showCustomWindows[index]}
                  @change=${(event: Event) => {
                    const showCustomWindows = this.showCustomWindows.slice()
                    showCustomWindows[index] = (event.target as HTMLInputElement).checked
                    this.showCustomWindows = showCustomWindows
                  }}
                />
              </span>
            </label>
          </div>
        </li>
      `
    })
  }

  render() {
    return html`
      <main data-theme="fantasy" class="bg-transparent">
        <div class="navbar bg-base-100 shadow-xl rounded-box flex item-center justify-between">
          <h1 class="ml-4 normal-case text-xl">
            ${IconCog}
            <span class="ml-2">${chrome.i18n.getMessage('SETTING')}</span>
          </h1>
          <img width="64" src="img/logo-128.png" />
        </div>

        <div class="navbar bg-base-100 shadow-xl rounded-box mt-4">
          <ul class="menu menu-compact bg-base-100 w-full p-2 rounded-box">
            <li class="menu-title w-full">
              <span>${chrome.i18n.getMessage('VIEW_REAL_TIME_DATA')}</span>
            </li>
            <li class="w-full flex">
              <label class="label cursor-pointer">
                <span class="label-text">${chrome.i18n.getMessage('USER_DATA')}</span>
                <input
                  type="checkbox"
                  class="toggle toggle-accent"
                  ?checked=${this.showUserWindow}
                  @change=${(event: Event) => {
                    this.showUserWindow = (event.target as HTMLInputElement).checked
                  }}
                />
              </label>
            </li>
            <li class="w-full flex">
              <label class="label cursor-pointer">
                <span class="label-text">${chrome.i18n.getMessage('RECENT_PRODUCT')}</span>
                <input
                  type="checkbox"
                  class="toggle toggle-accent"
                  ?checked=${this.showRecentProductWindow}
                  @change=${(event: Event) => {
                    this.showRecentProductWindow = (event.target as HTMLInputElement).checked
                  }}
                />
              </label>
            </li>
            <li class="w-full flex">
              <label class="label cursor-pointer">
                <span class="label-text">${chrome.i18n.getMessage('PICKED_ITEMS')}</span>
                <input
                  type="checkbox"
                  class="toggle toggle-accent"
                  ?checked=${this.showPickedItemsWindow}
                  @change=${(event: Event) => {
                    this.showPickedItemsWindow = (event.target as HTMLInputElement).checked
                  }}
                />
              </label>
            </li>
            <li class="w-full flex">
              <label class="label cursor-pointer">
                <span class="label-text">${chrome.i18n.getMessage('CART_ITEMS')}</span>
                <input
                  type="checkbox"
                  class="toggle toggle-accent"
                  ?checked=${this.showCartItemsWindow}
                  @change=${(event: Event) => {
                    this.showCartItemsWindow = (event.target as HTMLInputElement).checked
                  }}
                />
              </label>
            </li>
            <li class="menu-title w-full">
              <span class="flex items-center">
                <span>${chrome.i18n.getMessage('RECOMMENDED_API')}</span>
                <ul class="menu menu-horizontal">
                  <li>
                    <button
                      class="btn btn-xs btn-circle btn-outline p-0"
                      @click=${this.onClickOpenCategoryModal}
                    >
                      ${IconPlus}
                    </button>
                  </li>
                </ul>
              </span>
            </li>
            <li class="w-full flex">
              <div
                class="tooltip py-0"
                data-tip="${chrome.i18n.getMessage('HELP_TEXT_SEARCH_API')}"
              >
                <label class="label cursor-pointer">
                  <span class="flex items-center">
                    <span class="label-text">${chrome.i18n.getMessage('SEARCH_API')}</span>
                  </span>
                  <span>
                    <input
                      type="checkbox"
                      class="toggle toggle-accent"
                      ?checked=${this.enableSearchAPI}
                      @change=${(event: Event) => {
                        this.enableSearchAPI = (event.target as HTMLInputElement).checked
                      }}
                    />
                  </span>
                </label>
              </div>
            </li>
            ${this.renderCustomApiMenus()}
          </ul>
        </div>
      </main>
      <kurly-modal ?open=${this.categoryModalOpen}>
        <div class="modal-box overflow">
          <h3 class="font-bold text-lg mb-4">${chrome.i18n.getMessage('ADD_CATEGORY')}</h3>
          <label
            for="my-modal-3"
            class="btn btn-sm btn-circle absolute right-2 top-2"
            @click=${this.onClickCloseCategoryModal}
            >✕</label
          >
          <div tabindex="0" class="collapse collapse-arrow my-4">
            <input type="checkbox" class="peer" />
            <div class="collapse-title text-sm alert bg-primary text-primary-content">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="stroke-info flex-shrink-0 w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                API Response Body는 다음과 같은 형식만을 지원
              </span>
            </div>
            <div class="collapse-content">
              <div class="alert my-4">
                <pre>
              ${`[...,
{
  category: string
  id: number
  img_url: string
  index: number
  name: string
  origin_price: number
  sale_price: number
  score?: number
},
...]`}
            </pre
                >
              </div>
            </div>
          </div>
          <div class="form-control mb-4">
            <label class="input-group input-group-sm">
              <span class="whitespace-nowrap">${chrome.i18n.getMessage('API_NAME')}</span>
              <input
                type="text"
                placeholder="${chrome.i18n.getMessage('PLACEHOLDER_CATEGORY_NAME')}"
                class="input input-bordered input-sm outline-none-important w-full"
                .value=${this.apiName}
                @change=${(event: Event) => {
                  this.apiName = (event.target as HTMLInputElement).value
                }}
              />
            </label>
          </div>
          <div class="form-control mb-4">
            <label class="input-group input-group-sm">
              <span class="whitespace-nowrap">${chrome.i18n.getMessage('API_DESCRIPTION')}</span>
              <input
                type="text"
                placeholder="${chrome.i18n.getMessage('PLACEHOLDER_API_DESCRIPTION')}"
                class="input input-bordered input-sm outline-none-important w-full"
                .value=${this.apiDescription}
                @change=${(event: Event) => {
                  this.apiDescription = (event.target as HTMLInputElement).value
                }}
              />
            </label>
          </div>
          <div class="form-control">
            <label class="input-group input-group-sm">
              <span class="whitespace-nowrap">${chrome.i18n.getMessage('API_PATH')}</span>
              <input
                type="text"
                placeholder="https://"
                class="input input-bordered input-sm outline-none-important w-full"
                .value=${this.apiPath}
                @change=${(event: Event) => {
                  this.apiPath = (event.target as HTMLInputElement).value
                }}
              />
            </label>
          </div>
          <div class="modal-action" @click=${this.onClickAddCategory}>
            <label
              for="my-modal"
              class="btn btn-primary btn-block"
              @click=${this.categoryModalMode === `CREATE`
                ? this.onClickCreateApi
                : this.onClickEditApi}
              >${this.categoryModalMode === `CREATE`
                ? chrome.i18n.getMessage('ADD')
                : chrome.i18n.getMessage('EDIT')}</label
            >
          </div>
        </div>
      </kurly-modal>
    `
  }
}

export interface API {
  name: string
  description: string
  path: string
}

declare global {
  interface HTMLElementTagNameMap {
    'popup-main': PopupMain
  }
}
