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
    mitigationEffects: {},
  },
  getters: {
    getCaseData: (state) => ({ x: state.days, y: state.cases }),
    getCountryName: (state) => (state.countryName),
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
      state.days = [1];
      state.cases = [
        stateObj.initialInfected + stateObj.initialResolved,
      ];
      state.uncontrolledCases = [
        stateObj.initialInfected + stateObj.initialResolved,
      ];
      state.newCases = [
        0,
      ];
      state.currentCases = {
        0: stateObj.initialInfected,
      };
      state.susceptible = [
        stateObj.initialSusceptible,
      ];
      state.initialSusceptible = stateObj.initialSusceptible;
      state.population = stateObj.population;
      state.totalResCases = stateObj.initialResolved;
      state.susceptibleCases = [
        stateObj.initialSusceptible,
      ];
      state.activeCases = [
        stateObj.initialInfected,
      ];
      state.resolvedCases = [
        stateObj.initialResolved,
      ];
      state.intercept = stateObj.intercept;
      state.mitigationEffects = stateObj.coefficients;
      state.countryName = stateObj.countryName;
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
      const rVal = (calculateTotalCases(mitigationLevels, mitigationEffects, getIntercept))
         + jStat.normal.sample(0, 0.1);
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
