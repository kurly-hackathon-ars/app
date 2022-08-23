import { html, css, LitElement, unsafeCSS } from 'lit'
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

  // # Event handlers

  @eventOptions({})
  onClickDeleteCategory(event: Event): void {
    event.stopImmediatePropagation()
    // TODO: API 삭제
  }

  @eventOptions({})
  onClickEditCategory(event: Event): void {
    event.stopImmediatePropagation()
    // TODO: API 수정
  }

  @eventOptions({})
  onClickOpenCategoryModal(): void {
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
      ],
      (result: any) => {
        const {
          showUserWindow,
          showRecentProductWindow,
          showPickedItemsWindow,
          showCartItemsWindow,
          enableSearchAPI,
        } = result
        this.showUserWindow = showUserWindow
        this.showRecentProductWindow = showRecentProductWindow
        this.showPickedItemsWindow = showPickedItemsWindow
        this.showCartItemsWindow = showCartItemsWindow
        this.enableSearchAPI = enableSearchAPI
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
              <!-- <ul class="text-gray-400 p-0 mt-[-0.25rem]">
                <li class="mb-1">
                  <button
                    class="btn btn-xs btn-circle btn-outline p-0"
                    @click=${this.onClickEditCategory}
                  >
                    ${IconEdit}
                  </button>
                </li>
                <li>
                  <button
                    class="btn btn-xs btn-circle btn-outline p-0"
                    @click=${this.onClickDeleteCategory}
                  >
                    ${IconMinus}
                  </button>
                </li>
              </ul> -->
              <div class="tooltip" data-tip="${chrome.i18n.getMessage('HELP_TEXT_SEARCH_API')}">
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
          </ul>
        </div>
      </main>
      <kurly-modal ?open=${this.categoryModalOpen}>
        <div class="modal-box overflow-visible">
          <h3 class="font-bold text-lg mb-4">${chrome.i18n.getMessage('ADD_CATEGORY')}</h3>
          <label
            for="my-modal-3"
            class="btn btn-sm btn-circle absolute right-2 top-2"
            @click=${this.onClickCloseCategoryModal}
            >✕</label
          >
          <div class="form-control mb-4">
            <label class="input-group input-group-sm">
              <span class="whitespace-nowrap">${chrome.i18n.getMessage('CATEGORY_NAME')}</span>
              <input
                type="text"
                placeholder="${chrome.i18n.getMessage('PLACEHOLDER_CATEGORY_NAME')}"
                class="input input-bordered input-sm outline-none-important w-full"
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
              />
            </label>
          </div>
          <div class="modal-action" @click=${this.onClickAddCategory}>
            <label for="my-modal" class="btn btn-primary btn-block"
              >${chrome.i18n.getMessage('ADD')}</label
            >
          </div>
        </div>
      </kurly-modal>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'popup-main': PopupMain
  }
}
