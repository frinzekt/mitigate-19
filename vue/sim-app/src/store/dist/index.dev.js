Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _vue = _interopRequireDefault(require('vue'));

const _vuex = _interopRequireDefault(require('vuex'));

const _jstat = _interopRequireDefault(require('jstat'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _readOnlyError(name) { throw new Error(`"${name}" is read-only`); }

function ownKeys(object, enumerableOnly) { const keys = Object.keys(object); if (Object.getOwnPropertySymbols) { let symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter((sym) => Object.getOwnPropertyDescriptor(object, sym).enumerable); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (let i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach((key) => { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach((key) => { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value, enumerable: true, configurable: true, writable: true,
    });
  } else { obj[key] = value; } return obj;
}

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError('Invalid attempt to spread non-iterable instance'); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === '[object Arguments]') return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// import mapsData from '../data/maps';
_vue.default.use(_vuex.default);

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

const _default = new _vuex.default.Store({
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
    getCaseData: function getCaseData(state) {
      return {
        x: state.days,
        y: state.cases,
      };
    },
    getCountryName: function getCountryName(state) {
      return state.countryName;
    },
    getUncontrolledCase: function getUncontrolledCase(state) {
      return state.uncontrolledCases.slice(-1)[0];
    },
    getUncontrolledCaseData: function getUncontrolledCaseData(state) {
      return {
        x: state.days,
        y: state.uncontrolledCases,
      };
    },
    getNewCaseData: function getNewCaseData(state) {
      return {
        x: state.days,
        y: state.newCases,
      };
    },
    currentDay: function currentDay(state) {
      return state.days.slice(-1)[0];
    },
    lastCase: function lastCase(state) {
      return state.cases.slice(-1)[0];
    },
    lastUncontrolledCase: function lastUncontrolledCase(state) {
      return state.uncontrolledCases.slice(-1)[0];
    },
    getResolvedCases: function getResolvedCases(state) {
      return state.totalResCases;
    },
    getActiveCases: function getActiveCases(state) {
      return state.cases.slice(-1)[0] - state.totalResCases;
    },
    getSusceptibleData: function getSusceptibleData(state) {
      return {
        x: state.days,
        y: state.susceptibleCases,
      };
    },
    getActiveData: function getActiveData(state) {
      return {
        x: state.days,
        y: state.activeCases,
      };
    },
    getResolvedData: function getResolvedData(state) {
      return {
        x: state.days,
        y: state.resolvedCases,
      };
    },
    getPopulation: function getPopulation(state) {
      return state.population;
    },
    getIntercept: function getIntercept(state) {
      return state.intercept;
    },
  },
  mutations: {
    // eslint-disable-next-line
    setInitState: function setInitState(state, stateObj) {
      state.days = [1];
      state.cases = [stateObj.initialInfected + stateObj.initialResolved];
      state.uncontrolledCases = [stateObj.initialInfected + stateObj.initialResolved];
      state.newCases = [0];
      state.currentCases = {
        0: stateObj.initialInfected,
      };
      state.susceptible = [stateObj.initialSusceptible];
      state.initialSusceptible = stateObj.initialSusceptible;
      state.population = stateObj.population;
      state.totalResCases = stateObj.initialResolved;
      state.susceptibleCases = [stateObj.initialSusceptible];
      state.activeCases = [stateObj.initialInfected];
      state.resolvedCases = [stateObj.initialResolved];
      state.intercept = stateObj.intercept;
      state.mitigationEffects = stateObj.coefficients;
      state.countryName = stateObj.countryName;
    },
    addNewTotalCase: function addNewTotalCase(state, newCase) {
      state.cases = [].concat(_toConsumableArray(state.cases), [newCase]);
    },
    addNewUncontrolledCase: function addNewUncontrolledCase(state, newUncontrolledCase) {
      state.uncontrolledCases = [].concat(_toConsumableArray(state.uncontrolledCases), [newUncontrolledCase]);
    },
    addNewDailyCase: function addNewDailyCase(state, newCase) {
      state.newCases = [].concat(_toConsumableArray(state.newCases), [newCase]);
      const todaysCases = {};
      todaysCases[this.getters.currentDay] = newCase;

      let newCurrentCases = _objectSpread({}, state.currentCases, {}, todaysCases);

      const { currentDay } = this.getters;
      let totalResCases = 0;
      newCurrentCases = Object.keys(newCurrentCases).reduce((acc, caseKey) => {
        const dayDelta = currentDay - caseKey;
        const resCases = Math.round(_jstat.default.normal.cdf(dayDelta, 16, 4) * newCurrentCases[caseKey]);
        const remCases = Math.round(newCurrentCases[caseKey] - resCases);
        totalResCases += resCases;

        if (remCases > 0) {
          return _objectSpread({}, acc, _defineProperty({}, caseKey, remCases));
        }

        return acc;
      }, {});
      state.currentCases = _objectSpread({}, newCurrentCases);
      state.totalResCases += totalResCases;
      state.susceptibleCases = [].concat(_toConsumableArray(state.susceptibleCases), [state.initialSusceptible - this.getters.lastCase]);
      state.activeCases = [].concat(_toConsumableArray(state.activeCases), [this.getters.getActiveCases]);
      state.resolvedCases = [].concat(_toConsumableArray(state.resolvedCases), [state.totalResCases]);
    },
    addDay: function addDay(state) {
      state.days = [].concat(_toConsumableArray(state.days), [this.getters.currentDay + 1]);
    },
    changeParam: function changeParam(state, payload) {
      const { id } = payload;
      const { level } = payload;
      const mitObj = {};
      mitObj[id] = level;
      state.mitigationLevels = _objectSpread({}, state.mitigationLevels, {}, mitObj);
    },
  },
  actions: {
    simulateDay: function simulateDay(_ref) {
      const { commit } = _ref;
      const _this$state = this.state;
      const { mitigationLevels } = _this$state;
      const { mitigationEffects } = _this$state;
      const _this$getters = this.getters;
      const { lastCase } = _this$getters;
      const { lastUncontrolledCase } = _this$getters;
      const { getIntercept } = _this$getters;

      const randomNoise = _jstat.default.normal.sample(0, 0.1);

      const rVal = calculateTotalCases(mitigationLevels, mitigationEffects, getIntercept) + randomNoise;
      let newTotalCases = Math.exp(rVal) * lastCase >= lastCase ? Math.exp(rVal) * lastCase : lastCase;
      newTotalCases = Math.round(newTotalCases);
      const uncontrolledR = Math.exp(getIntercept) + randomNoise;
      let newUncontrolledCase = uncontrolledR * lastUncontrolledCase >= lastUncontrolledCase;
      newUncontrolledCase = (_readOnlyError('newUncontrolledCase'), Math.round(newUncontrolledCase) ? uncontrolledR * lastUncontrolledCase : lastUncontrolledCase);

      if (newUncontrolledCase >= this.getters.getPopulation) {
        newUncontrolledCase = (_readOnlyError('newUncontrolledCase'), this.getters.getPopulation);
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
  modules: {},
});

exports.default = _default;
