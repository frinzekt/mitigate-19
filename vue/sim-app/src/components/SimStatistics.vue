<template>
  <div id="controls">
    <v-row>
      <v-col cols=6>
        <v-card>
          <br>
        <v-row align="center" justify="center">
          <h1> {{ $store.getCountryName }}</h1>
        </v-row>
        <v-col  depressed class="text-center">
              <h3>DAY: {{ $store.getters.currentDay }}</h3>
            </v-col>
          <v-card-actions class="justify-center pa-2">
            <v-btn class="pa-2" x-large color="success" min-width="50%"
            v-show="sim === false" @click="startSim">
              RUN Simulation
              <v-icon large class="pl-3" >
                mdi-play-circle-outline
              </v-icon>
            </v-btn>

            <v-btn class="pa-2" x-large color="error" min-width="50%"
            v-show="sim === true" @click="stopSim">
              HALT Simulation
              <v-icon large class="pl-3" >
                mdi-stop-circle-outline
              </v-icon>
            </v-btn>
            <v-btn class="pa-2" x-large color="info" min-width="50%"
            v-show="sim === false"
            to='/'
            >
             RETURN TO MAP
              <v-icon large class="pl-3" >
                mdi-map-marker-radius
              </v-icon>
            </v-btn>
          </v-card-actions>
          <br>

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
        </v-card>
      </v-col>
      <v-col col='6'>
        <v-card>
          <v-row>
            <v-col cols="12" sm="6" md="6" depressed class="text-center">
              <h1>With Mitigations <br> </h1>
            </v-col>
            <v-col cols="12" sm="6" md="6" depressed class="text-center">
              <h1>No Mitigations <br> </h1>
            </v-col>
            <v-col cols="12" sm="6" md="6" depressed class="text-center">
              <h3>TOTAL CASES: <br> {{ $store.getters.lastCase }} </h3>
            </v-col>
            <v-col cols="12" sm="6" md="6" depressed class="text-center">
              <!-- NO MITIGATIONS -->
              <h3>TOTAL CASES: <br> {{ $store.getters.getUncontrolledCase }} </h3>
            </v-col>
            <v-col cols="12" sm="6" md="6" depressed class="text-center">
              <h3>ACTIVE CASES: <br> {{ $store.getters.getActiveCases }} </h3>
            </v-col>
            <v-col cols="12" sm="6" md="6" depressed class="text-center">
              <!-- NO MITIGATIONS -->
              <!-- <h3>ACTIVE CASES: <br> {{ $store.getters.getActiveCases }} </h3> -->
            </v-col>
            <v-col cols="12" sm="6" md="6" depressed class="text-center">
              <h3>RESOLVED: <br>{{ $store.getters.getResolvedCases }} </h3>
            </v-col>
            <v-col cols="12" sm="6" md="6" depressed class="text-center">
              <!-- NO MITIGATIONS -->
              <!-- <h3>RESOLVED: <br>{{ $store.getters.getResolvedCases }} </h3> -->
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
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
