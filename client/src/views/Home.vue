<template>
  <div class="home pt-2 px-6">
    <div class="columns is-multiline">
      <div class="column is-one-quarter-desktop">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <p class="is-size-2">Cars</p>
              <p>
                <router-link to="/cars">
                  View all the cars
                  <b-icon icon="arrow-right" size="is-small"></b-icon>
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <p class="is-size-2">Customers</p>
              <p>
                <router-link to="/customers">
                  Manage customers
                  <b-icon icon="arrow-right" size="is-small"></b-icon>
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <p class="is-size-2">Rentals</p>
              <p>
                <router-link to="/rentals">
                  Manage rentals
                  <b-icon icon="arrow-right" size="is-small"></b-icon>
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>


<style lang="scss" scoped>
.home {
  flex-grow: 1;
}
</style>
