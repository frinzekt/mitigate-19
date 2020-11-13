import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

function calculateCases(mitigationLevels, mitigationEffects) {
  const coefficientVals = Object.keys(mitigationLevels).reduce((acc, mitKey) => {
    if (typeof mitigationLevels[mitKey] !== 'undefined') {
      return acc + mitigationLevels[mitKey] * mitigationEffects[mitKey];
    }
    return acc;
  }, 0);
  return mitigationEffects[0] + coefficientVals;
}

export default new Vuex.Store({
  state: {
    days: [0],
    cases: [0],
    newCases: [],
    mitigationLevels: {},
    mitigationEffects: {
      0: 2.9210526313963783,
      1: 1106.2977107310305,
      2: 186.6691558352654,
      3: 760.076377304738,
      4: 4501.329575823488,
      5: 867.0828531747405,
      6: 65.60007638255261,
      7: -174.1810173493972,
      8: 2848.982583141036,
      9: -595.122576424033,
      10: 194.08680831566494,
      11: -76.86994372551989,
      12: 194.0868083156648,
      13: 3567.1663577200757,
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
      // const { lastCase } = this.getters;
      const { mitigationLevels, mitigationEffects } = this.state;
      const newCase = calculateCases(mitigationLevels, mitigationEffects);
      // const newCase = Math.exp(lastCase);
      commit('addCase', newCase);
      commit('addDay');
    },
  },
  modules: {
  },
});
