<!-- Navigation: Represents the pandel on the left, used to navigate an inventory  -->

<script>
    import {InventoryStore} from "../../stores/inventory-store";
    import NavInventory from './NavInventory2.vue'
    import NavSelect from './NavSelect.vue'
    import NavFooter from './NavFooter.vue'

    export default {
        data() {
            return {
                loading: false,
                navigation: null
            }
        },
        setup() {
            const inventoryStore = InventoryStore()
            return {
                inventoryStore: inventoryStore
            }
        },
        emits: [
            'inventory-select',
            'inventory-create',
            'group-select',
            'group-create',
            'group-delete',
            'asset-select',
            'asset-create',
            'asset-delete',
            'auth-failure'
        ],
        components: {
            navInventory: NavInventory,
            navSelect: NavSelect,
            navFooter: NavFooter
        },
        methods: {
            hasInventory() {
                if(this.$refs.inventory) {
                    return this.$refs.inventory.getSelected()!==null
                } else {
                    return false
                }
            },
            /**
             * Returns the current state
             */
            getState: function() {
                return {
                    inventory: this.$refs.inventory.getSelected(),
                    group: this.$refs.select.getGroup(),
                    asset: this.$refs.select.getSelectedAsset()
                }
            },
            _onInventorySelect(inventory) {
                this.$router.push(`/inventory/${inventory.inventoryId}`)
            },
            _onInventoryCreate() {
                this.$refs.select.selectedAsset = null
                this.$emit('inventory-create')
            },
            _onGroupSelect(group) {
                this.$router.push(`/inventory/${this.navigation.inventory.inventoryId}/group/${group.groupId}`)
            },
            _onGroupCreate() {
                // if anything is selected, unselect it
                this.$refs.select.selectedAsset = null
                this.$emit('group-create')
            },
            _onGroupDelete(group) {
                this.$emit('group-delete', group)
            },
            _onAssetSelect(asset) {
                this.$router.push(`/inventory/${this.navigation.inventory.inventoryId}/asset/${asset.assetId}`)
            },
            _onAssetCreate() {
                // if anything is selected, unselect it
                this.$refs.select.selectedAsset = null
                this.$emit('asset-create')
            },
            _onAssetDelete(asset) {
                this.$emit('asset-delete', asset)
            },
            async _navigate(route) {
                this.loading = true

                let inventoryId = route.params.inventoryId
                let groupId = route.params.groupId
                let assetId = route.params.assetId

                try {
                    let response = await this.$client.getNavigation(inventoryId, groupId, assetId)
                    
                    if(response.status===200) {
                        // ok
                        this.navigation = response.body
                        
                    } else if(response.status===401 || response.status===403) {
                        // auth issue
                        this.$emit('auth-failure')
                    } else {
                        // something else
                    }
                } finally {
                    this.loading=false
                }
            }
        },
        mounted() {
            // if defined, pull
            let inventoryId = this.$route.params.inventoryId
            let groupId = this.$route.params.groupId
            let assetId = this.$route.params.assetId

            if(inventoryId || groupId || assetId) {
                // load nav
                this._navigate(this.$route)
            }
        },
        watch: {
            $route(to, from) {
                let toInventoryId = to.params.inventoryId
                let toGroupId = to.params.groupId
                let toAssetId = to.params.assetId

                let fromInventoryId = from.params.inventoryId
                let fromGroupId = from.params.groupId
                let fromAssetId = from.params.assetId

                if(toInventoryId!==fromInventoryId || toGroupId!==fromGroupId || toAssetId!==fromAssetId) {
                    // load nav
                    this._navigate(to)
                }
            }
        }
    }
</script>

<template>
    <div class="navigation">
        <div class="nav-row">
            <nav-inventory
                ref="inventory"
                @item-select="_onInventorySelect"
                @item-new="_onInventoryCreate" />
        </div>
        <div class="nav-row nav-fill">
            <nav-select
                ref="select"
                :disabled="loading"
                :groups="navigation ? navigation.childGroups : []"
                :assets="navigation ? navigation.childAssets : []"
                @group-select="_onGroupSelect"
                @group-delete="_onGroupDelete"
                @asset-select="_onAssetSelect"
                @asset-delete="_onAssetDelete"/>
        </div>
        <div class="nav-row">
            <nav-footer
                @new-inventory="_onInventoryCreate"
                @new-group="_onGroupCreate"
                @new-asset="_onAssetCreate"
                :disabled="$route.params.inventoryId==null" />
        </div>
    </div>
</template>

<style>
    .navigation {
        display: table;
        margin: 0;
        width: 100%;
        height: 100%;
    }

    .navigation .nav-row {
        display: table-row;
        width: 100%;
    }

    .navigation .nav-fill {
        height: 100%;
    }
</style>