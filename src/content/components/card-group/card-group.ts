import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'

import tailwind from '../../../styles/tailwind.css?inline'

@customElement('kurly-card-group')
export class KurlyCardGroup extends LitElement {
  static styles = [unsafeCSS(tailwind)]

  render() {
    return html`
      <div
        data-theme="fantasy"
        class="navbar bg-base-100 shadow-xl rounded-box flex item-center justify-between mb-4"
      >
        <h1 class="ml-4 normal-case text-xl">
          <span class="ml-2">${chrome.i18n.getMessage('RECOMMEND_PRODUCT')}</span>
        </h1>
      </div>
      <div data-theme="fantasy" class="flex flex-col w-full lg:flex-row overflow-x-scroll">
        <slot></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kurly-card-group': KurlyCardGroup
  }
}
