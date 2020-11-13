<template>
  <div id="controls">
    <v-card>
      <v-card-title> Customise the simulation </v-card-title>
      <v-card-text>
        <ul>
          <li>
            <v-slider
          max="950"
          min="50"
          v-model="speed"
          @change="changeSpeed"
          color='accent'
          :label="`Simulation speed (${speedDisplay})`"
        ></v-slider>
          </li>
          <li v-for='(mit, i) in mitigations' :key='mit.id'>
            <v-slider
            :label='`${mit.name} (${mitigations[i].level})`'
            v-model='mitigations[i]["level"]'
            color='accent'
            :max='mit.levels - 1'
            @change='changeParams(i)'
            min=0
            >
            </v-slider>
          </li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-btn v-show="sim === false" @click="startSim"> Start sim</v-btn>
        <v-btn v-show="sim === true" @click="stopSim"> Stop sim</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import mitigations from '../data/mitigations';

export default {
  data() {
    return {
      sim: false,
      intervalId: null,
      speed: 50,
      mitigations: [],
    };
  },
  methods: {
    startSim() {
      this.sim = true;
      this.intervalId = setInterval(() => {
        this.$store.dispatch('simulateDay');
      }, this.trueSpeed);
    },
    stopSim() {
      clearInterval(this.intervalId);
      this.sim = false;
    },
    changeSpeed() {
      if (this.sim) {
        this.stopSim();
        this.startSim();
      }
    },
    changeParams(param) {
      this.$store.commit('changeParam', {
        id: param,
        level: this.mitigations[param].level,
      });
    },
  },
  computed: {
    trueSpeed() {
      return 2050 - this.speed;
    },
    speedDisplay() {
      return `${this.trueSpeed / 1000} seconds/day`;
    },
  },
  mounted() {
    this.mitigations = mitigations;
  },
};
</script>
<style scoped>
  li {
    list-style-type: none;
  }
</style>
