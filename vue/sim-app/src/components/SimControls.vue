<template>
  <div id="controls">
    <v-card>
      <v-card-title> Customise the simulation </v-card-title>
      <v-card-text>
        <p> Total cases: {{ $store.getters.lastCase }} </p>
        <p> Active cases: {{ $store.getters.getActiveCases }} </p>
        <p> Resolved cases: {{ $store.getters.getResolvedCases }} </p>
        <ul>
          <li>
            <v-row>
              <v-col cols="12" sm="6" md="4" depressed>
                  <p class="pa-2"><b>Simulation speed</b> ({{speedDisplay}})</p>
              </v-col>
              <v-col cols="6" md="8">
                <v-slider
              max="950"
              min="50"
              depressed
              v-model="speed"
              @change="changeSpeed"
              color="accent"
            ></v-slider>
              </v-col>
            </v-row>
          </li>

          <li v-for="(mit, i) in mitigations" :key="mit.id">
           <v-card>
            <v-row>
              <v-col cols="12" sm="6" md="4" depressed>
                  <p class="pa-2" > {{mit.name}} </p>
              </v-col>
              <v-col cols="6" md="8">
                  <v-slider
                    :label="` (${mitigations[i].level})`"
                    v-model="mitigations[i]['level']"
                    color="accent"
                    depressed
                    :max="mit.levels - 1"
                    @change="changeParams(i)"
                    min="0"
                  >
                  </v-slider>
              </v-col>
            </v-row>
           </v-card>
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
