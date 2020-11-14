<template>
  <v-app-bar app color="primary" dark>
    <v-btn
    to='/'
    class='accent darken-1'
    small
    >
      Home
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn
    small
    @click='$vuetify.theme.dark = !$vuetify.theme.dark;'
    >
      Toggle Dark Theme
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {};
</script>

<style>
</style>
