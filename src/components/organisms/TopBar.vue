<template lang="pug">
section
  .topbar(:class="{'topbar--rinkeby': isRinkeby, 'topbar--unsupported': isUnsupportedNet }" )
    client-only
      .topbar__rinkebyLogo(v-if="isRinkeby") Rinkeby
      .topbar__unsupported(v-if="isUnsupportedNet") Unsupported Network
      img.topbar__logo(src="~/assets/images/logo.png")
      .topbar__navigation
        button.topbar__navigation__account(
          v-if="!hasWallet"
          @click="sendToMetamask"
        ) Install Wallet
        button.topbar__navigation__account(
          v-else
          @click="handleAccountBtnClick"
        )
          .topbar__navigation__account__image(
            v-if="hasProfileImage"
            :style="`background-image: url(${profileImageUrl})`"
          )
          span {{accountBtnText}}
        .topbar__info(@click="showModal = true") ?
      modal(
      @modal-close="() => this.showModal = false"
      v-if="showModal"
      )
          template(
          slot="header"
          v-if="modalTab === 1"
          )
              img.modal__image(src="~/assets/images/icons/kitty-dai.png")
          template(
          slot="header"
          v-else
          )
              img.modal__image__large(src="~/assets/images/enemies/2.png")

          .modal__content(v-if="modalTab === 1") Earn DAI battling your CryptoKitties to the death
          .modal__content(v-else) Your kitty just may be the one to beat the Raid Boss to claim victory 💰from the kitties that came before you
          template(
          slot="footerOneBtn"
          )
              button(
              v-on:click="this.onClick"
              ) {{modalTab === 1 ? "Next" : "Play"}}
</template>

<script lang="ts">
  import { Component, Vue, State } from 'nuxt-property-decorator'
  import Modal from '~/components/molecules/Modal.vue'

@Component({
  components: {
    Modal
  }
})
  export default class TopBar extends Vue {
    @State ownProfile
    @State ownAddress
    @State networkId

    public account = ''
    public showInfo = false
    private showModal = false
    private modalTab = 1

    async beforeMount () {
      await this.loadAccount()
    }

  onClick () {
    if (this.modalTab === 2) {
      this.showModal = false
      this.modalTab = 1
    } else {
      this.modalTab = 2
    }
  }

    get hasWallet (): Boolean {
      return this.$ethereumService.hasWallet
    }

    get accountBtnText () {
      if (this.hasThreeBoxProfile) { return this.ownProfile.name }
      if (this.account.length) { return this.account }
      return 'Connect Wallet'
    }

    get hasThreeBoxProfile () {
      return !!this.ownProfile.name
    }

    get hasProfileImage () {
      return this.ownProfile.image && this.ownProfile.image[0]
    }

    get profileImageUrl () {
      if (!this.hasThreeBoxProfile) { return this.randomAvatarUrl }
      if (!this.hasProfileImage) { return this.randomAvatarUrl }
      const ipfsHash = this.ownProfile.image[0].contentUrl['/']
      return `https://ipfs.infura.io/ipfs/${ipfsHash}`
    }

    get randomAvatarUrl () {
      return `https://api.adorable.io/avatars/180/${this.ownAddress}.png`
    }

    get isMainnet () {
      return this.networkId === 1
    }

    get isRinkeby () {
      return this.networkId === 4
    }

    get isUnsupportedNet () {
      return !(this.isMainnet || this.isRinkeby)
    }

    handleAccountBtnClick () {
      if (this.account.length) { return }
      return this.enableWallet()
    }

    sendToMetamask () {
      return window.open('https://metamask.io/')
    }

    async loadAccount () {
      this.account = await this.$ethereumService.getCurrentAccountAsync()
    }

    async enableWallet () {
      await this.$ethereumService.unlockWallet()
      this.loadAccount()
    }
  }
</script>

<style lang="scss" scoped>
.topbar {
  @extend %row;
  position: relative;
  padding: 0.25rem 1rem;
  justify-content: space-between;
  background-color: rgba($color-obsidian, 0.85);
  border-bottom: 2px solid $color-magikarp;
  z-index: 999;
  @include breakpoint(sm) {
    padding: 0.5rem 2rem;
  }

  &--rinkeby {
    border-bottom: 2px solid $color-kournikova;
  }

  &--unsupported {
    border-bottom: 2px solid $color-error;
  }

  // for the nuxt links
  a {
    display: flex;
  }

  &__logo {
    height: 2rem;
    width: auto;
  }

  &__rinkebyLogo {
    position: absolute;
    bottom: -1.5rem;
    left: 1rem;
    color: $color-obsidian;
    background-color: $color-kournikova;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    border-radius: 0 0 0.25rem 0.25rem;
  }

  &__unsupported {
    position: absolute;
    bottom: -1.5rem;
    left: 1rem;
    color: $color-obsidian;
    background-color: $color-error;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    border-radius: 0 0 0.25rem 0.25rem;
  }

  &__logo {
    height: 1.25rem;
    width: auto;
    @include breakpoint(sm) {
      height: 2rem;
    }
  }

  &__navigation {
    @extend %row;
    padding: 0.3rem 0;
    // temp
    p {
      font-size: 0.8rem;
      transition: 0.1s ease-in-out;
      &:hover {
        cursor: pointer;
        color: lighten($color-magikarp, 2);
      }
      @include breakpoint(sm) {
        font-size: 1rem;
      }
    }
    a + a {
      margin-left: 0.75rem;

      @include breakpoint(sm) {
        margin-left: 2rem;
      }
    }

    &__account {
      @extend %row;
      justify-content: flex-start;
      margin-left: 1.5rem;
      font-family: $font-mono;
      font-weight: 300;
      background-color: $color-woodsmoke;
      padding: 0.35rem 0.5rem;
      border-radius: 0.25rem;
      max-width: 10rem;
      border: none;
      outline: none;
      color: $color-swan;
      transition: 0.1s ease-in-out;
      font-size: 0.8rem;

      span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &:hover {
        cursor: pointer;
        background-color: lighten($color-woodsmoke, 10);
      }

      @include breakpoint(sm) {
        margin-left: 4rem;
        max-width: 15rem;
        padding: 0.5rem 1rem;
      }

      &__image {
        margin-right: 0.5rem;
        background-position: center;
        background-size: cover;
        background-repeat: none;
        height: 1.1rem;
        width: 1.1rem;
        border-radius: 50%;
        flex: 1 0 auto;
        @include breakpoint(sm) {
          margin-right: 1rem;
          height: 1.1rem;
          width: 1.1rem;
        }
      }
    }
  }

  &__info {
    @extend %row;
    border-radius: 50%;
    margin-left: 0.5rem;
    padding: 0.25rem;
    width: 1rem;
    height: 1rem;
    background-color: $color-woodsmoke;
    color: $color-magikarp;

    &:hover {
      cursor: pointer;
      background-color: lighten($color-woodsmoke, 5);
    }
  }
}

.dropdown {
  display: flex;
  justify-content: flex-end;
  margin-left: 0.5rem;
  @include breakpoint(sm) {
    height: 1rem;
  }

  img {
    height: 1.2rem;
    width: auto;
    @include breakpoint(sm) {
      height: 1.2rem;
    }
  }

  &-trigger {
    @extend %row;

    .button {
      @extend %row;
      background-color: $color-woodsmoke;
      border-radius: 0.25rem;
      line-height: 1;
      padding: 0.25rem 0.5rem;

      @include breakpoint(sm) {
        padding: 0.4rem 1rem;
      }

      svg {
        margin-left: 0.5rem;
      }

      &:hover {
        cursor: pointer;
        background-color: lighten($color-woodsmoke, 10);
      }
    }
  }

  &-content {
    background-color: $color-woodsmoke;
    border: 1px solid rgba($color-swan, 0.5);
    padding: 0;
  }

  &-item + &-item {
    border-top: 1px solid rgba($color-swan, 0.5);
  }
  &-item {
    font-family: $font-standard;
    border: none;
    color: $color-swan;
    background-color: $color-woodsmoke;
    text-decoration: none;
    &:hover {
      cursor: pointer;
    }
  }

}
.modal {
    &__image {
        width: auto;
        height: auto;
        max-width: 5rem;
        max-height: 5rem;
        &__large {
            width: auto;
            height: auto;
            max-width: 10rem;
            max-height: 10rem;
        }
    }
}
</style>
