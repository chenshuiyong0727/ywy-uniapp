
export const mixin = {
  data() {
    return {
      isShowFab: true
    }
  },
  onHide() {
    this.isShowFab = false
  },
  onShow() {
    this.isShowFab = true
  },
  methods: {
    
  }
}
