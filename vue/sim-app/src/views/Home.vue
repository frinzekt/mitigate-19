<template>
  <div class="home">
    <v-container
    >
    <v-row
      align='center'
      justify='center'
      >
        <GraphSim />
      </v-row>
    </v-container>
  </div>
</template>

<script>
import GraphSim from '../components/GraphSim.vue';

// @ is an alias to /src
export default {
  name: 'Home',
  components: {
    GraphSim,
  },
};
</script>
