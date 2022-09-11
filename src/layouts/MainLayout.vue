<template>
  <q-layout view="lHh lpR fFf">
    <login-dialog ref="login" />
    
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar square>
            <img src="~assets/logo.svg">
          </q-avatar>
          Lil-Inventory
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer persistent show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <div style="display: table; margin: 0; width: 100%; height: 100%;">
        <div style="display: table-row; width: 100%;">
          <inventory @select="onInventorySelect" @auth-failure="$refs.login.open('Session Ended')" />
        </div>
        <div style="display: table-row; width: 100%; height: 100%;">
          <navigation ref="navigation" @auth-failure="$refs.login.open('Session Ended')" />
        </div>
        <div style="display: table-row; width: 100%; ">
          <q-btn unelevated icon="add" color="primary" label="Group" size="sm" style="width: calc(50% - 4px); margin: 2px;" />
          <q-btn unelevated icon="add" color="primary" label="Asset" size="sm" style="width: calc(50% - 4px); margin: 2px;" />
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue'
import LoginDialog from 'src/components/LoginDialog.vue'
import Inventory from 'src/components/Inventory.vue'
import Navigation from 'src/components/Navigation.vue'

export default {
  components: {
    inventory: Inventory,
    navigation: Navigation,
    loginDialog: LoginDialog
  },
  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      opts: ['Apple', 'Booba', 'Cat'],
      groups: ['AAA', 'BBBooba', 'CCCC'],
      assets: ['ABC123', 'XYZ', 'Zipper']
    }
  },
  methods: {
    onInventorySelect(inventory) {
      this.$refs.navigation.navigate(inventory.inventoryId)
    }
  }
}
</script>
