<script>


  export default {
    emits: [
      'asset-select',
      'asset-delete',
      'group-select',
      'group-delete',
      'auth-failure'
    ],
    data() {
      return {
        selected: null,
        groupId: null,
        path: [],
        groups: [],
        assets: []
      }
    },
    methods: {
      deleteGroup: function(e, group) {
        e.stopPropagation()

        console.log('delete group')
        console.log(group)

        this.$emit('group-delete', group)
      },
      deleteAsset: function(e, asset) {
        e.stopPropagation()

        console.log('delete asset')
        console.log(asset)

        this.$emit('asset-delete', asset)
      },
      navigate: function(inventoryId, groupId = null) {
        this.selected = null
        this.$client.getNavigation(inventoryId, groupId).then(r => {
          if(r.status===200) {
            // ok
            console.log(r)
            this.groupId = r.body.groupId
            this.path = r.body.path
            this.groups = r.body.groups
            this.assets = r.body.assets
          } else if(r.status===401 || r.status===403) {
            // auth issue
            this.$emit('auth-failure')
          } else {
            // error
            // TODO
          }
        })
      }
    }
  }
</script>

<template>
  <div class="navigation">
    <q-list v-if="groups.length>0 || assets.length>0" padding dense>

      <q-item-label v-if="groups.length>0" header>Groups</q-item-label>

      <q-item v-for="group in groups" clickable v-ripple :active="selected===group" active-class="my-menu-link"
        @click="selected=group">

        <q-item-section avatar top>
          <q-icon name="folder" color="primary" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{ group }}</q-item-label>
        </q-item-section>

        <q-item-section>
          <div style="display: table">
            <div style="display: table-row; float: right;">
              <q-btn flat class="delete" size="xs" padding="xs" color="primary" icon="close" @click="deleteGroup($event, group)">
                <q-tooltip transition-show="flip-right" transition-hide="flip-left" :delay="500" anchor="center right"
                  self="bottom left">Delete</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-item-section>

      </q-item>

      <q-separator v-if="groups.length>0" spaced />


      <q-item-label v-if="assets.length>0" header>Assets</q-item-label>

      <q-item v-for="asset in assets" clickable v-ripple :active="selected===asset" @click="()=> {selected=asset; $emit('asset-select', asset)}" active-class="my-menu-link">
        <q-item-section avatar top>
          <q-icon name="insert_drive_file" color="primary" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{ asset.name }}</q-item-label>
        </q-item-section>

        <q-item-section>
          <div style="display: table">
            <div style="display: table-row; float: right;">
              <q-btn flat class="delete" size="xs" padding="xs" color="primary" icon="close" @click="deleteAsset($event, asset)">
                <q-tooltip transition-show="flip-right" transition-hide="flip-left" :delay="500" anchor="center right"
                  self="bottom left">Delete</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-item-section>

      </q-item>

    </q-list>
    <div class="empty" v-else>
      Empty
    </div>
  </div>
</template>

<style>
.navigation .q-item__section--avatar {
  min-width: 30px;
  padding: 0px;
}

.navigation .q-list--padding .q-item__label--header {
  padding: 0px 0px 8px 16px;
}

.my-menu-link {
  color: white;
  background: #f5b677;
}

.navigation .q-hoverable:hover .delete {
  visibility: visible
}

.navigation .q-hoverable .delete {
  visibility: hidden
}

.navigation .empty {
  width: 100%;
  text-align: center;
  top: 40%;
  position: absolute;
  color: lightgray;
  user-select: none;
  -moz-user-select: none;
}
</style>