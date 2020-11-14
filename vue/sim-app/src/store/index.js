import Vue from 'vue';
import Vuex from 'vuex';
import jStat from 'jstat';

Vue.use(Vuex);

// function calculateStringency(mitigationLevels) {
//   const measureSum = Object.keys(mitigationLevels).reduce((acc, mitKey) => {
//     if (typeof mitigationLevels[mitKey] !== 'undefined') {
//       return acc + mitigationLevels[mitKey];
//     }
//     return acc;
//   }, 0);
//   return 36 / (36 + measureSum);
// }
// function calculateTotalCases(stringency) {
//   return 91 + 47654450 * Math.exp(15 * stringency);
// }
// eslint-disable-next-line
function calculateTotalCases(mitigationLevels, mitigationEffects, currentDay) {
  const coefficientVals = Object.keys(mitigationLevels).reduce((acc, mitKey) => {
    if (typeof mitigationLevels[mitKey] !== 'undefined') {
      return acc + mitigationLevels[mitKey] * mitigationEffects[mitKey];
    }
    return acc;
  }, 0);
  // return mitigationEffects[0] + coefficientVals + mitigationEffects[15] * currentDay;
  return mitigationEffects[0] + coefficientVals;
}

export default new Vuex.Store({
  state: {
    days: [1],
    cases: [1],
    newCases: [1],
    currentCases: {
      0: 1,
    },
    susceptible: [0],
    mitigationLevels: {},
    initialSusceptible: 1000000,
    totalResCases: 0,
    susceptibleCases: [1000000],
    activeCases: [1],
    resolvedCases: [0],
    mitigationEffects: {
      0: 0.9,
      1: -0.0028409946757642734,
      2: -0.12088134746950325,
      3: -0.09681341847794962,
      4: -0.11532028644532705,
      5: -0.10048213521767001,
      6: -0.13915792737940207,
      7: -0.2602076881195024,
      8: -0.3334791179962779,
      9: -0.12842595793420545,
      10: -0.11680938020303011,
      11: -0.11435936758966538,
      12: -0.024702057674936173,
      13: -0.11435936758966564,
      14: -0.0028350173045424567,
    },
  },
  getters: {
    getCaseData: (state) => ({ x: state.days, y: state.cases }),
    getNewCaseData: (state) => ({ x: state.days, y: state.newCases }),
    currentDay: (state) => (state.days.slice(-1)[0]),
    lastCase: (state) => (state.cases.slice(-1)[0]),
    getResolvedCases: (state) => (state.totalResCases),
    getActiveCases: (state) => (state.cases.slice(-1)[0] - state.totalResCases),
    getSusceptibleData: (state) => ({ x: state.days, y: state.susceptibleCases }),
    getActiveData: (state) => ({ x: state.days, y: state.activeCases }),
    getResolvedData: (state) => ({ x: state.days, y: state.resolvedCases }),
  },
  mutations: {
    addNewTotalCase(state, newCase) {
      state.cases = [...state.cases, newCase];
    },
    addNewDailyCase(state, newCase) {
      state.newCases = [...state.newCases, newCase];
      const todaysCases = {};
      todaysCases[this.getters.currentDay] = newCase;
      let newCurrentCases = {
        ...state.currentCases,
        ...todaysCases,
      };
      const { currentDay } = this.getters;
      let totalResCases = 0;
      newCurrentCases = Object.keys(newCurrentCases).reduce((acc, caseKey) => {
        const dayDelta = currentDay - caseKey;
        const resCases = Math.round(jStat.normal.cdf(dayDelta, 16, 4) * newCurrentCases[caseKey]);
        const remCases = Math.round(newCurrentCases[caseKey] - resCases);
        totalResCases += resCases;
        if (remCases > 0) {
          return {
            ...acc,
            [caseKey]: remCases,
          };
        }
        return acc;
      }, {});
      state.currentCases = {
        ...newCurrentCases,
      };
      state.totalResCases += totalResCases;

      state.susceptibleCases = [
        ...state.susceptibleCases,
        state.initialSusceptible - this.getters.lastCase,
      ];
      state.activeCases = [
        ...state.activeCases,
        this.getters.getActiveCases,
      ];
      state.resolvedCases = [
        ...state.resolvedCases,
        state.totalResCases,
      ];
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
      const { mitigationLevels, mitigationEffects } = this.state;
      const { currentDay, lastCase } = this.getters;
      // const stringency = calculateStringency(mitigationLevels);
      // const newTotalCases = calculateTotalCases(mitigationLevels, mitigationEffects, currentDay);
      const rVal = calculateTotalCases(mitigationLevels, mitigationEffects, currentDay);
      let newTotalCases = Math.exp(rVal) * lastCase >= lastCase
        ? (Math.exp(rVal) * lastCase) : (lastCase);
      newTotalCases = Math.round(newTotalCases);
      const newDailyCase = newTotalCases - lastCase;
      commit('addNewTotalCase', newTotalCases);
      commit('addNewDailyCase', newDailyCase);
      commit('addDay');
    },
  },
  modules: {
  },
});
