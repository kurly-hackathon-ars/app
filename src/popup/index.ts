import { html, css, LitElement, unsafeCSS } from 'lit'
import { customElement, eventOptions, property } from 'lit/decorators.js'

import tailwind from '../styles/tailwind.css?inline'

import { IconCog, IconEdit, IconMinus, IconPlus } from '../content/components/icons/icons'
import '../content/components/modal/modal'

/**
 * popup
 */
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

  @property({ type: Boolean })
  categoryModalOpen = false

  @eventOptions({})
  onClickDeleteCategory(event: Event): void {
    event.stopImmediatePropagation()
    alert('Delete')
  }

  @eventOptions({})
  onClickEditCategory(event: Event): void {
    event.stopImmediatePropagation()
    alert('Edit')
  }

  @eventOptions({})
  openCategoryModal(): void {
    this.categoryModalOpen = true
  }

  @eventOptions({})
  closeCategoryModal(): void {
    this.categoryModalOpen = false
  }

  @eventOptions({})
  addCategory(): void {
    this.closeCategoryModal()
  }

  render() {
    return html`
      <main data-theme="fantasy" class="bg-transparent">
        <div class="navbar bg-base-100 shadow-xl rounded-box flex item-center justify-between">
          <h1 class="ml-4 normal-case text-xl">
            ${IconCog}
            <span class="ml-2">${chrome.i18n.getMessage('SETTING')}</span>
          </h1>
          <img width="64" src="src/assets/logo.png" />
        </div>

        <div class="navbar bg-base-100 shadow-xl rounded-box mt-4">
          <ul class="menu menu-compact bg-base-100 w-full p-2 rounded-box">
            <li class="menu-title w-full">
              <span>실시간 데이터 조회</span>
            </li>
            <li class="w-full flex">
              <label class="label cursor-pointer">
                <span class="label-text">검색</span>
                <input type="checkbox" class="toggle toggle-accent" checked />
              </label>
            </li>
            <li class="w-full flex">
              <label class="label cursor-pointer">
                <span class="label-text">최근 본 상품</span>
                <input type="checkbox" class="toggle toggle-accent" checked />
              </label>
            </li>
            <li class="w-full flex">
              <label class="label cursor-pointer">
                <span class="label-text">찜</span>
                <input type="checkbox" class="toggle toggle-accent" checked />
              </label>
            </li>
            <li class="w-full flex">
              <label class="label cursor-pointer">
                <span class="label-text">장바구니</span>
                <input type="checkbox" class="toggle toggle-accent" checked />
              </label>
            </li>
            <li class="w-full flex">
              <label class="label cursor-pointer">
                <span class="label-text">구매내역</span>
                <input type="checkbox" class="toggle toggle-accent" checked />
              </label>
            </li>
            <li class="menu-title w-full">
              <span class="flex items-center">
                <span>추천 카테고리</span>
                <ul class="menu menu-horizontal">
                  <li>
                    <button
                      class="btn btn-xs btn-circle btn-outline p-0"
                      @click=${this.openCategoryModal}
                    >
                      ${IconPlus}
                    </button>
                  </li>
                </ul>
              </span>
            </li>
            <li class="w-full flex">
              <ul class="text-gray-400 p-0 mt-[-0.25rem]">
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
              </ul>
              <label class="label cursor-pointer">
                <span class="flex items-center">
                  <span class="label-text">카테고리 A</span>
                </span>
                <span>
                  <input type="checkbox" class="toggle toggle-accent" checked />
                </span>
              </label>
            </li>
            <li class="w-full flex">
              <ul class="text-gray-400 p-0 mt-[-0.25rem]">
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
              </ul>
              <label class="label cursor-pointer">
                <span class="flex items-center">
                  <span class="label-text">카테고리 B</span>
                </span>
                <span>
                  <input type="checkbox" class="toggle toggle-accent" checked />
                </span>
              </label>
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
            @click=${this.closeCategoryModal}
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
          <div class="modal-action" @click=${this.addCategory}>
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
