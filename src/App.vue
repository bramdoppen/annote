<template>
  <router-view/>
</template>

<script>
export default {
   data() {
    return { user: null }
  }
}
</script>

<style>

:root {
  --c-one: #ffcdb2;
  --c-two: #ffb4a2;
  --c-three: #e5989b;
  --c-four: #b5838d;
  --c-five: #6d6875;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
}
html, body {
  margin: 0;
}

* {
  box-sizing: border-box;
}

h1, h2 {
  color: var(--c-five);
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
