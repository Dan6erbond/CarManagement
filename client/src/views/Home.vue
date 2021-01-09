<template>
  <div class="home">
    <div class="columns">
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <p class="is-size-2">Cars</p>
              <p><router-link to="/cars">View all the cars</router-link></p>
              <p><router-link to="/makes">By make</router-link></p>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <p class="is-size-2">Customers</p>
              <p><router-link to="/makes">Manage customers</router-link></p>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <p class="is-size-2">Rentals</p>
              <p><router-link to="/makes">Manage rentals</router-link></p>
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
