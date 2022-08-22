import { html, css, LitElement, unsafeCSS, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import tailwind from '../../../styles/tailwind.css?inline'

@customElement('user-info')
export class UserInfo extends LitElement {
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

  @property()
  id = '사용자 ID'

  @property()
  name = '이름'

  @property()
  grade = '등급'

  @property({ type: Boolean })
  isLogin = false

  // # Getters

  get avatarPlaceholder(): string {
    return this.name.charAt(0).toUpperCase()
  }

  // # Lifecycle hooks

  connectedCallback() {
    super.connectedCallback()

    this.#getUserInfo()
  }

  #getUserInfo(): void {
    chrome.storage.local.get(['userInfo'], async (result: any) => {
      const userInfo = result.userInfo

      if (userInfo === null) {
        this.isLogin = false
      } else {
        this.isLogin = true
      }

      this.id = userInfo.id
      this.name = userInfo.name
      this.grade = userInfo.grade
    })
  }

  render() {
    const { id, name, grade, avatarPlaceholder } = this

    if (this.isLogin === false) return this.renderNoLoginTemplate()

    return html`
      <div
        data-theme="fantasy"
        class="flex items-center space-x-3 w-full h-full p-4 bg-base-100 shadow-xl"
      >
        <div class="avatar online placeholder">
          <div class="bg-neutral-focus text-neutral-content rounded-full w-16">
            <span class="text-xl">${avatarPlaceholder}</span>
          </div>
        </div>
        <div>
          <div class="font-bold">${name}</div>
          <div class="text-sm opacity-50">${id}</div>
        </div>
        <div class="card-actions justify-end">
          <div class="badge badge-outline">${grade}</div>
        </div>
      </div>
    `
  }

  renderNoLoginTemplate(): TemplateResult {
    return html`
      <div
        data-theme="fantasy"
        class="flex items-center space-x-3 w-full h-full p-4 bg-base-100 shadow-xl"
      >
        <div class="avatar offline placeholder">
          <div class="bg-neutral-focus text-neutral-content rounded-full w-16">
            <span class="text-sm">Logout</span>
          </div>
        </div>
        <div>
          <div class="text-sm opacity-50">${chrome.i18n.getMessage('REQUIRED_LOGIN')}</div>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-info': UserInfo
  }
}
