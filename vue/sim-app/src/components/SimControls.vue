<template>
  <div id="controls">
    <v-card>
      <h2 class="text-center pa-2"><u>Customise the Simulation</u></h2>
      <v-card-subtitle><b>Simulation settings:</b></v-card-subtitle>
      <v-card-text>
        <v-expansion-panels>
          <v-expansion-panel readonly>
            <v-expansion-panel-header>
              <template v-slot:actions>
                <v-icon color="error">
                  mdi-blank
                  </v-icon>
                  </template>
              <v-row>
                <v-col cols="12" sm="6" md="4" depressed>
                     <p class="py-1"><b>Simulation speed</b> (seconds/day)</p>
                </v-col>
                <v-col cols="6" md="2">
                  <v-chip color="accent">
                    {{speedDisplay}}
                  </v-chip>
                </v-col>
                <v-col cols="6" md="6">
                  <v-slider
                    max="950"
                    min="50"
                    depressed
                    v-model="speed"
                    @change="changeSpeed"
                    color="accent">
                  </v-slider>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-card-subtitle><b>Mitigation strategies:</b></v-card-subtitle>
      <v-card-text>
        <v-expansion-panels>
          <v-expansion-panel v-for="(mit, i) in mitigations" :key="mit.id">
            <v-expansion-panel-header>
              <v-row>
                <v-col cols="12" sm="6" md="4" depressed>
                    <p class="py-1" > {{mit.name}} </p>
                </v-col>
                <v-col cols="6" md="2">
                  <v-chip color="accent">
                    {{mitigations[i].level}}
                  </v-chip>
                </v-col>
                <v-col cols="6" md="6">
                  <v-slider
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
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-for='(description, j) in mitigations[i].levelDescriptors' :key="j">
                <p>
                  <b>{{j}}:</b> {{mitigations[i].levelDescriptors[j]}}
                </p>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>

        </v-expansion-panels>
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
      return `${this.trueSpeed / 1000}`;
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
