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
        <b-navbar-item tag="router-link" to="/rentals">Rentals</b-navbar-item>
        <b-navbar-dropdown label="Cars">
          <b-navbar-item
            v-for="make in makes"
            :key="make.id"
            tag="router-link"
            :to="'/cars/' + make.slug"
          >
            {{ make.name }}
          </b-navbar-item>
        </b-navbar-dropdown>
        <b-navbar-item tag="router-link" to="/customers">
          Customers
        </b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">© 2021, RaviAnand M.</b-navbar-item>
      </template>
    </b-navbar>
    <main role="main"><router-view /></main>
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  apollo: {
    makes: gql`
      {
        makes {
          id
          name
          slug
        }
      }
    `,
  },
};
</script>

<style lang="scss">
html,
body,
#app {
  min-height: 100vh;
}

#app {
  display: flex;
  flex-direction: column;
}

main {
  flex-grow: 1;
  display: flex;
  align-items: stretch;
}
</style>
