import { html, LitElement, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import tailwind from '../../../styles/tailwind.css?inline'

@customElement('kurly-card')
export class KurlyCard extends LitElement {
  static styles = [unsafeCSS(tailwind)]

  @property({ type: Number })
  price = 50000

  get priceString(): string {
    return this.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원'
  }

  render() {
    const { priceString } = this
    console.log({ priceString })
    return html`
      <div data-theme="fantasy" class="card card-compact w-96 bg-base-100 shadow-xl m-4">
        <figure class="h-[200px]">
          <img
            height="200"
            src="https://img-cf.kurly.com/cdn-cgi/image/width=676,format=auto/shop/data/goods/1596778215374l0.jpg"
            alt="Shoes"
          />
        </figure>
        <div class="card-body bg-white">
          <h2 class="card-title font-normal">
            [서울한정 예약딜리버리] 형제상회 프리미엄 모듬회(소)(8/27(토))
          </h2>
          <p class="card-text font-bold">${priceString}</p>
          <div class="card-actions justify-end">
            <div class="badge badge-outline">수산</div>
            <div class="badge badge-outline">해산</div>
            <div class="badge badge-outline">건어물</div>
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
