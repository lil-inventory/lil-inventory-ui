<script>
  import ConfirmDialog from '../ConfirmDialog.vue'

  export default {
    emits: [
      'group-select',
      'group-delete',
      'asset-select',
      'asset-delete'
    ],
    components: {
      confirmDelete: ConfirmDialog
    },
    props: {
      groups: Array,
      assets: Array,

      /**
       * Disables the components
       */
      disabled: Boolean,
    },
    methods: {
      _getSelectedAssetId() {
        return this.$route.params.assetId
      },
      _deleteGroup: function(e, group) {
        e.stopPropagation()

        console.log('delete group')
        console.log(group)
        
        let self = this
        this.$refs.confirmDelete.open({
            messageText: `Are you sure you want to delete group '${group.name}'`,
            onAccept: function() {
              self.$emit('group-delete', group)
            }
        })
      },
      _deleteAsset: function(e, asset) {
        e.stopPropagation()

        console.log('delete asset')
        console.log(asset)

        let self = this
        this.$refs.confirmDelete.open({
            messageText: `Are you sure you want to delete asset '${asset.name}'`,
            onAccept: function() {
              self.$emit('asset-delete', asset)
            }
        })
      }
    }
  }
</script>

<template>
  <confirm-delete ref="confirmDelete" icon="delete" />

  <div class="navigation">
    <q-list v-if="groups.length>0 || assets.length>0" padding dense>

      <q-item-label v-if="groups.length>0" header>Groups</q-item-label>

      <q-item v-for="group in groups" clickable v-ripple active-class="my-menu-link"
        @click="()=> {$emit('group-select', group)}">

        <q-item-section avatar top>
          <q-icon name="folder" color="primary" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{ group.name }}</q-item-label>
        </q-item-section>

        <q-item-section>
          <div style="display: table">
            <div style="display: table-row; float: right;">
              <q-btn flat class="delete" size="xs" padding="xs" color="primary" icon="close" @click="_deleteGroup($event, group)">
                <q-tooltip transition-show="flip-right" transition-hide="flip-left" :delay="500" anchor="center right"
                  self="bottom left">Delete</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-item-section>

      </q-item>

      <q-separator v-if="groups.length>0" spaced />


      <q-item-label v-if="assets.length>0" header>Assets</q-item-label>

      <q-item v-for="asset in assets" clickable v-ripple :active="asset.assetId==_getSelectedAssetId()" @click="() => {$emit('asset-select', asset)}" active-class="my-menu-link">
        <q-item-section avatar top>
          <q-icon name="insert_drive_file" color="primary" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{ asset.name }}</q-item-label>
        </q-item-section>

        <q-item-section>
          <div style="display: table">
            <div style="display: table-row; float: right;">
              <q-btn flat class="delete" size="xs" padding="xs" color="primary" icon="close" @click="_deleteAsset($event, asset)">
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