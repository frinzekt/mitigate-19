<template>
  <div id="controls">
    <v-card>
      <v-card-subtitle><b>Mitigation strategies:</b></v-card-subtitle>
      <v-card-text>
        <v-expansion-panels>
          <v-row>
            <v-col cols=20 sm="6" md="6" depressed>
          <v-expansion-panel v-for="(mit, i) in mitigations" :key="mit.id">
            <v-expansion-panel-header v-if="i%2==0">
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
            <v-expansion-panel-content v-if="i%2==0">
              <div v-for='(description, j) in mitigations[i].levelDescriptors' :key="j">
                <p>
                  <b>{{j}}:</b> {{mitigations[i].levelDescriptors[j]}}
                </p>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
            </v-col>
            <v-col cols=20 sm="6" md="6" depressed>
              <v-expansion-panel v-for="(mit, i) in mitigations" :key="mit.id">
            <v-expansion-panel-header v-if="i%2==1">
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
            <v-expansion-panel-content v-if="i%2==1">
              <div v-for='(description, j) in mitigations[i].levelDescriptors' :key="j">
                <p>
                  <b>{{j}}:</b> {{mitigations[i].levelDescriptors[j]}}
                </p>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
            </v-col>
              </v-row>

        </v-expansion-panels>
      </v-card-text>
      <v-card-actions>

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
