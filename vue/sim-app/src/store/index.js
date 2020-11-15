import Vue from 'vue';
import Vuex from 'vuex';
import jStat from 'jstat';

Vue.use(Vuex);

function calculateTotalCases(mitigationLevels, mitigationEffects, intercept) {
  const coefficientVals = Object.keys(mitigationLevels).reduce((acc, mitKey) => {
    if (mitKey === 0) {
      return acc;
    }
    if (typeof mitigationLevels[mitKey] !== 'undefined') {
      return acc + mitigationLevels[mitKey].currentLevel * mitigationEffects[mitKey];
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
    countryName: '',
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
    adjustLevels(state) {
      const newMitLevels = {};
      Object.keys(state.mitigationLevels).forEach((mitKey) => {
        const oldMitObj = state.mitigationLevels[mitKey];
        const { levelQueue, currentLevel } = oldMitObj;
        const newMitObj = {
          currentLevel,
        };
        const newLevelQueue = [];
        levelQueue.forEach((level) => {
          if (level.daysRem - 1 === 0) {
            newMitObj.currentLevel = level.level;
            console.log(`14 days hit for ${mitKey} changing level to ${level.level}`);
          } else {
            newLevelQueue.push({
              level: level.level,
              daysRem: level.daysRem - 1,
            });
          }
        });
        newMitObj.levelQueue = newLevelQueue;
        newMitLevels[mitKey] = newMitObj;
        console.log(levelQueue);
      });
      state.mitigationLevels = newMitLevels;
    },
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
      let mitObj = {};
      if (!state.mitigationLevels[id]) {
        mitObj.currentLevel = 0;
        mitObj.levelQueue = [];
        mitObj.levelQueue.push({
          level,
          daysRem: 14,
        });
      } else {
        mitObj = state.mitigationLevels[id];
        mitObj.levelQueue.push({
          level,
          daysRem: 14,
        });
      }
      state.mitigationLevels = {
        ...state.mitigationLevels,
        [id]: mitObj,
      };
      console.log(state.mitigationLevels);
    },
  },
  actions: {
    simulateDay({ commit }) {
      const { mitigationLevels, mitigationEffects } = this.state;
      const { lastCase, lastUncontrolledCase, getIntercept } = this.getters;
      commit('adjustLevels');
      const randomNoise = jStat.normal.sample(0, 0.1);
      const rVal = (calculateTotalCases(mitigationLevels, mitigationEffects, getIntercept));
      let newTotalCases = (Math.exp(rVal) + randomNoise) * lastCase >= lastCase
        ? ((Math.exp(rVal) + randomNoise) * lastCase) : (lastCase);
      newTotalCases = Math.round(newTotalCases);

      const uncontrolledR = Math.exp(getIntercept) + randomNoise;
      let newUncontrolledCase = (uncontrolledR * lastUncontrolledCase) >= lastUncontrolledCase
        ? (uncontrolledR * lastUncontrolledCase) : lastUncontrolledCase;
      newUncontrolledCase = Math.round(newUncontrolledCase);
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
