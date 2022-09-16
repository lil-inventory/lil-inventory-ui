<!-- Navigation: Represents the pandel on the left, used to navigate an inventory  -->

<script>
    import NavInventory from './NavInventory.vue'
    import NavSelect from './NavSelect.vue'
    import NavFooter from './NavFooter.vue'

    export default {
        emits: [
            'inventory-select',
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
        data() {
            return {
                inventory: null,
                group: null,
                asset: null
            }
        },
        methods: {
            /**
             * Returns the current state
             */
            getState: function() {
                return {
                    inventory: this.inventory,
                    group: this.group,
                    asset: this.asset
                }
            },
            /**
             * Navigates the the given location.
             * @param {Number} inventoryId the inventory id
             * @param {Number} groupId the group id, null for the root location
             */
            navigate: function(inventoryId, groupId = null) {
                this.$refs.select.navigate(inventoryId, groupId)
            },
            _onInventorySelect(inventory) {
                this.inventory = inventory
                this.group = null
                this.asset = null
                this.navigate(inventory.inventoryId)
                this.$emit('inventory-select', inventory)
            },
            _onGroupSelect(group) {
                this.group = group
                this.asset = null
                this.navigate(this.inventory.inventoryId, grou.groupId)
                this.$emit('group-select', group)
            },
            _onGroupCreate() {
                // if anything is selected, unselect it
                this.$refs.select.selected = null
                this.$emit('group-create')
            },
            _onGroupDelete(group) {
                this.$emit('group-delete', group)
            },
            _onAssetSelect(asset) {
                this.asset = asset
                this.$emit('asset-select', asset)
            },
            _onAssetCreate() {
                // if anything is selected, unselect it
                this.$refs.select.selected = null
                this.$emit('asset-create')
            },
            _onAssetDelete(asset) {
                this.$emit('asset-delete', asset)
            }
        }
    }
</script>

<template>
    <div class="navigation">
        <div class="nav-row">
            <nav-inventory
                @select="_onInventorySelect"
                @auth-failure="$emit('auth-failure')" />
        </div>
        <div class="nav-row nav-fill">
            <nav-select
                ref="select"
                @group-select="_onGroupSelect"
                @asset-select="_onAssetSelect"
                @auth-failure="$emit('auth-failure')" />
        </div>
        <div class="nav-row">
            <nav-footer
                @new-group="_onGroupCreate"
                @new-asset="_onAssetCreate"
                :disabled="inventory==null" />
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