<template>
  <v-app-bar app color="primary" dark>
    <v-btn
    to='/'
    class='accent darken-1'
    >
      Home
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn
    @click='$vuetify.theme.dark = !$vuetify.theme.dark;'
    >
      Toggle dark mode
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {};
</script>

<style>
</style>
