import Vue from 'vue';
import Vuex from 'vuex';
import jStat from 'jstat';
// import mapsData from '../data/maps';

Vue.use(Vuex);

function calculateTotalCases(mitigationLevels, mitigationEffects, intercept) {
  const coefficientVals = Object.keys(mitigationLevels).reduce((acc, mitKey) => {
    if (mitKey === 0) {
      return acc;
    }
    if (typeof mitigationLevels[mitKey] !== 'undefined') {
      return acc + mitigationLevels[mitKey] * mitigationEffects[mitKey];
    }
    return acc;
  }, 0);
  return intercept + coefficientVals;
}

export default new Vuex.Store({
  state: {
    days: [],
    cases: [],
    uncontrolledCases: [],
    newCases: [],
    currentCases: {},
    susceptible: [],
    mitigationLevels: {},
    initialSusceptible: 0,
    population: 0,
    totalResCases: 0,
    susceptibleCases: [],
    activeCases: [],
    resolvedCases: [],
    intercept: 0,
    mitigationEffects: {
      // 0: -0.1829422386127879,
      // 1: -0.07784000618252508,
      // 2: -0.06234176943449615,
      // 3: -0.07425903166854986,
      // 4: -0.06470419291570209,
      // 5: -0.08960897735105754,
      // 6: -0.1675574311170926,
      // 7: -0.2147396364283757,
      // 8: -0.08269826212945952,
      // 9: -0.07521791465366225,
      // 10: -0.07364026019361672,
      // 11: -0.015906575848049855,
      // 12: -0.07364026019361689,
      // 13: -0.001825573333957288,

    },
  },
  getters: {
    getCaseData: (state) => ({ x: state.days, y: state.cases }),
    getUncontrolledCase: (state) => (state.uncontrolledCases.slice(-1)[0]),
    getUncontrolledCaseData: (state) => ({ x: state.days, y: state.uncontrolledCases }),
    getNewCaseData: (state) => ({ x: state.days, y: state.newCases }),
    currentDay: (state) => (state.days.slice(-1)[0]),
    lastCase: (state) => (state.cases.slice(-1)[0]),
    lastUncontrolledCase: (state) => (state.uncontrolledCases.slice(-1)[0]),
    getResolvedCases: (state) => (state.totalResCases),
    getActiveCases: (state) => (state.cases.slice(-1)[0] - state.totalResCases),
    getSusceptibleData: (state) => ({ x: state.days, y: state.susceptibleCases }),
    getActiveData: (state) => ({ x: state.days, y: state.activeCases }),
    getResolvedData: (state) => ({ x: state.days, y: state.resolvedCases }),
    getPopulation: (state) => (state.population),
    getIntercept: (state) => (state.intercept),
  },
  mutations: {
    // eslint-disable-next-line
    setInitState(state, stateObj) {
      state.days = [...state.days, 1];
      state.cases = [
        ...state.cases,
        stateObj.initialInfected + stateObj.initialResolved,
      ];
      state.uncontrolledCases = [
        ...state.uncontrolledCases,
        stateObj.initialInfected + stateObj.initialResolved,
      ];
      state.newCases = [
        ...state.newCases,
        0,
      ];
      state.currentCases = {
        ...state.currentCases,
        0: stateObj.initialInfected,
      };
      state.susceptible = [
        ...state.susceptible,
        stateObj.initialSusceptible,
      ];
      state.initialSusceptible = stateObj.initialSusceptible;
      state.population = stateObj.population;
      state.totalResCases = stateObj.initialResolved;
      state.susceptibleCases = [
        ...state.susceptibleCases,
        stateObj.initialSusceptible,
      ];
      state.activeCases = [
        ...state.activeCases,
        stateObj.initialInfected,
      ];
      state.resolvedCases = [
        ...state.resolvedCases,
        stateObj.initialResolved,
      ];
      state.intercept = stateObj.intercept;
      state.mitigationEffects = stateObj.coefficients;
      console.log(this.state);
    },
    addNewTotalCase(state, newCase) {
      state.cases = [...state.cases, newCase];
    },
    addNewUncontrolledCase(state, newUncontrolledCase) {
      state.uncontrolledCases = [
        ...state.uncontrolledCases,
        newUncontrolledCase,
      ];
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
      const { lastCase, lastUncontrolledCase, getIntercept } = this.getters;
      const rVal = calculateTotalCases(mitigationLevels, mitigationEffects, getIntercept);
      let newTotalCases = Math.exp(rVal) * lastCase >= lastCase
        ? (Math.exp(rVal) * lastCase) : (lastCase);
      newTotalCases = Math.round(newTotalCases);
      let newUncontrolledCase = Math.exp(getIntercept) * lastUncontrolledCase;
      if (newUncontrolledCase >= this.getters.getPopulation) {
        newUncontrolledCase = this.getters.getPopulation;
      }
      if (newTotalCases >= this.getters.getPopulation) {
        newTotalCases = this.getters.getPopulation;
      }
      const newDailyCase = newTotalCases - lastCase;
      commit('addNewUncontrolledCase', newUncontrolledCase);
      commit('addNewTotalCase', newTotalCases);
      commit('addNewDailyCase', newDailyCase);
      commit('addDay');
    },
  },
  modules: {
  },
});
