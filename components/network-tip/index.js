import networkTipComponent from './index.vue'
const networkTipPlugin = {
  install(Vue) {
    const networkTip = Vue.component('networkTip', networkTipComponent);
   
    const dlg = new networkTip();
    const vm = dlg.$mount();
    document.querySelector('body').appendChild(vm.$el);

    Vue.prototype.$networkTip = {
      showTip(params = {}) {
        return dlg.showTip(params)
      },
      closeTip() {
        return dlg.closeTip()
      }
    };
  }
};

export default networkTipPlugin;
