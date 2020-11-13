import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

function calculateCases(mitigationLevels, mitigationEffects, currentDay) {
  const coefficientVals = Object.keys(mitigationLevels).reduce((acc, mitKey) => {
    if (typeof mitigationLevels[mitKey] !== 'undefined') {
      return acc + mitigationLevels[mitKey] * mitigationEffects[mitKey];
    }
    return acc;
  }, 0);
  return mitigationEffects[0] + coefficientVals + mitigationEffects[14] * currentDay;
}

export default new Vuex.Store({
  state: {
    days: [0],
    cases: [0],
    newCases: [],
    mitigationLevels: {},
    mitigationEffects: {
      0: 0,
      1: -402.16673808482875,
      2: 1684.3602563772204,
      3: 310.8952363169325,
      4: 811.6903236195732,
      5: 2187.8906635480243,
      6: 489.0801720013597,
      7: -470.7719920923992,
      8: -271.78393696707127,
      9: 1221.9028332767414,
      10: -1750.1569378405422,
      11: -494.2256362203956,
      12: -643.3034244138163,
      13: -494.22563622039513,
      14: 2153.5186994384967,
      15: 57.609729922086764,
    },
  },
  getters: {
    getCaseData: (state) => ({ x: state.days, y: state.cases }),
    currentDay: (state) => (state.days.slice(-1)[0]),
    lastCase: (state) => (state.cases.slice(-1)[0]),
  },
  mutations: {
    addCase(state, newCase) {
      state.cases = [...state.cases, newCase];
    },
    addDay(state) {
      state.days = [...state.days, this.getters.currentDay + 1];
    },
    changeParam(state, payload) {
      const { id, level } = payload;
      const mitObj = {};
      mitObj[id] = level;
      state.mitigationLevels = {
        ...state.mitigationLevels,
        ...mitObj,
      };
    },
  },
  actions: {
    simulateDay({ commit }) {
      const { currentDay } = this.getters;
      const { mitigationLevels, mitigationEffects } = this.state;
      const newCase = calculateCases(mitigationLevels, mitigationEffects, currentDay);
      // const newCase = Math.exp(lastCase);
      commit('addCase', newCase);
      commit('addDay');
    },
  },
  modules: {
  },
});
