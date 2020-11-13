<template>
  <div id="controls">
    <v-card>
      <v-card-title> Customise the simulation </v-card-title>
      <v-card-actions>
        <v-btn v-show="sim === false" @click="startSim"> Start sim</v-btn>
        <v-btn v-show="sim === true" @click="stopSim"> Stop sim</v-btn>
        <v-spacer></v-spacer>
        <v-slider
          max="950"
          min="50"
          v-model="speed"
          @change="changeSpeed"
          color="accent"
          label="Simulation speed"
        ></v-slider>
        {{ speedDisplay }}
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sim: false,
      intervalId: null,
      speed: 50,
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
      return `${this.trueSpeed / 1000} seconds/day`;
    },
  },
};
</script>

<style>
</style>
