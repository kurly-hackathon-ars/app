import { html, LitElement, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import tailwind from '../../../styles/tailwind.css?inline'

@customElement('kurly-card')
export class KurlyCard extends LitElement {
  static styles = [unsafeCSS(tailwind)]

  @property({ type: Number })
  no = 0

  @property()
  name = ``

  @property({ type: Number })
  price = 50000

  @property()
  categoryString = ``

  @property()
  imgSrc = `https://img-cf.kurly.com/cdn-cgi/image/width=676,format=auto/shop/data/goods/1596778215374l0.jpg`

  get priceString(): string {
    return this.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원'
  }

  get categoryArray(): string[] {
    return this.categoryString.split(`/`)
  }

  render() {
    const { no, name, priceString, categoryArray, imgSrc } = this

    return html`
      <div data-theme="fantasy" class="card card-compact w-96 bg-base-100 shadow-xl m-4">
        <figure class="h-[200px]">
          <img height="200" src="${imgSrc}" alt="Shoes" />
        </figure>
        <div class="card-body bg-white">
          <h2 class="card-title font-normal"><a href="${no}">${name}</a></h2>
          <p class="card-text font-bold text-left">${priceString}</p>
          <div class="card-actions justify-end">
            ${categoryArray.map(
              (category) => html`<div class="badge badge-outline">${category}</div>`,
            )}
          </div>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kurly-card': KurlyCard
  }
}
