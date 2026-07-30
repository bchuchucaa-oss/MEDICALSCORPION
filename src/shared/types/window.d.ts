import type { MosaApi } from '../../../electron/preload/index'

declare global {
  interface Window {
    mosa: MosaApi
  }
}

export {}
