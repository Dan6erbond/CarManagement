<template>
  <div id="app">
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img
            src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
            alt="Lightweight UI components for Vue.js based on Bulma"
          />
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" to="/rentals">Rentals </b-navbar-item>
        <b-navbar-dropdown label="Cars">
          <b-navbar-item tag="router-link" to="/makes">By Make</b-navbar-item>
          <b-navbar-item tag="router-link" to="/cars">All</b-navbar-item>
        </b-navbar-dropdown>
        <b-navbar-item tag="router-link" to="/customers">Customers</b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          © 2021, RaviAnand M.
        </b-navbar-item>
      </template>
    </b-navbar>
    <router-view />
  </div>
</template>

<style lang="scss">
</style>
