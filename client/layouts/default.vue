<template lang="pug">
v-layout.DefaultLayout
  nuxt
</template>

<script lang="ts">
    import Vue from 'vue'
    import { Component } from 'vue-property-decorator'

    @Component
    export default class DefaultLayout extends Vue {
    }
</script>

<style lang="sass" scoped>
.DefaultLayout
  font-family: 'Roboto', sans-serif

</style>
