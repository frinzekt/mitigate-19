import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    days: [0, 1],
    cases: [0, 1],
    newCases: [],
  },
  getters: {
    getCaseData: (state) => ({ x: state.days, y: state.cases }),
    currentDay: (state) => (state.days.splice(-1)[0]),
  },
  mutations: {
    addCase(state, newCase) {
      state.cases = [...state.cases, newCase];
    },
    addDay(state) {
      state.days = [...state.days, this.getters.currentDay + 1];
    },
  },
  actions: {
  },
  modules: {
  },
});
