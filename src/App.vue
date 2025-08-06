<template>
  <div id="app">
    <GestureRecognizer />
  </div>
</template>

<script>
import GestureRecognizer from "./components/GestureRecognizer.vue";

export default {
  name: "App",
  components: {
    GestureRecognizer,
  },
};
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
