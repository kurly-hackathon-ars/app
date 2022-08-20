import { html, LitElement, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

import tailwind from '../../../styles/tailwind.css?inline'

@customElement('kurly-modal')
export class KurlyModal extends LitElement {
  static styles = [unsafeCSS(tailwind)]

  @property({ type: Boolean })
  open = false

  render() {
    return html`
      <div
        class=${classMap({
          modal: true,
          'modal-open': this.open,
        })}
        data-theme="fantasy"
      >
        <slot></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kurly-modal': KurlyModal
  }
}
