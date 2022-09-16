<template>
  <q-layout view="lHh lpR fFf">
    <login-dialog ref="login" />
    
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar square style="border-radius: 3px">
            <img src="~assets/logo.svg">
          </q-avatar>
          <span style="margin-left: 10px;">lil-inventory</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer persistent show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <navigation
        ref="navigation"
        @inventory-select="onInventorySelect"
        @group-select="onGroupSelect"
        @group-create="onNewGroup"
        @group-delete=""
        @asset-select="onAssetSelect"
        @asset-create="onNewAsset"
        @asset-delete=""
        @auth-failure="" />
    </q-drawer>    

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue'
import LoginDialog from 'src/components/LoginDialog.vue'
import Navigation from 'src/components/navigation/Navigation.vue'


export default {
  components: {
    navigation: Navigation,
    loginDialog: LoginDialog,
},
  data() {
    return {
      inventory: null,
      group: null,
      asset: null
    }
  },
  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  methods: {
    onInventorySelect(inventory) {
      this.$router.push(`/inventory/${inventory.inventoryId}`)
    },
    onGroupSelect(group) {
    },
    onAssetSelect(asset) {
      let state = this.$refs.navigation.getState()
      this.$router.push(`/inventory/${state.inventory.inventoryId}/asset/${asset.assetId}`)
      console.log(asset)
    },
    onNewGroup() {
      let state = this.$refs.navigation.getState()
      if(state.group) {
        this.$router.push(`/inventory/${state.inventory.inventoryId}/group/${state.group.groupId}/create-group`)
      } else {
        this.$router.push(`/inventory/${state.inventory.inventoryId}/create-group`)
      }
    },
    onNewAsset() {
      let state = this.$refs.navigation.getState()
      if(state.group) {
        this.$router.push(`/inventory/${state.inventory.inventoryId}/group/${state.group.groupId}/create-asset`)
      } else {
        this.$router.push(`/inventory/${state.inventory.inventoryId}/create-asset`)
      }
    }
  }
}
</script>
