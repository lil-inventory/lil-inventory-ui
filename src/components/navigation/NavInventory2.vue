<script>
    import InventorySelect from '../ItemFilterSelect.vue'
    export default {
        emits: ["auth-failure"],
        components: {
            invetory: InventorySelect
        },
        data() {
            return {
                inventories: []
            }
        },
        methods: {
            getSelected() {
                return this.$refs.inventory.selected
            },
            getItems(callback) {
                // pull the latest
                this.$client.getInventories().then(r => {
                    if(r.status===200) {
                        // ok
                        this.inventories = r.body
                        callback.update(this.inventories)
                    } else if(r.status===401 || r.status===403) {
                        // auth issue
                        callback.abort()
                        this.$emit('auth-failure')
                    } else {
                        // something else
                        callback.abort()
                    }
                })
            },
            filterItems(filter, callback) {
                // filter what we have
                if(!filter) {
                    callback.update(this.inventories)
                    return
                }

                const needle = filter.toLowerCase()
                let filtered = this.inventories.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
                callback.update(filtered)
            },
            deleteItem(inventory, filter, callback) {
                this.$client.deleteInventory(inventory.inventoryId).then(r => {
                    if(r.status===200) {
                        // ok
                        this.getItems(callback)
                    } else if(r.status===401 || r.status===403) {
                        // auth issue
                        callback.abort()
                        this.$emit('auth-failure')
                    } else {
                        // something else
                        callback.abort()
                    }
                })
            },
            loadSelected (callback) {
                let routeId = this.$route.params.inventoryId
                
                if(routeId) {
                    this.$client.getInventory(this.$route.params.inventoryId).then(r => {
                        if(r.status===200) {
                            // ok
                            this.inventory = r.body
                            callback.selected(this.inventory)
                        } else if(r.status===401 || r.status===403) {
                            // auth issue
                            callback.abort()
                            this.$emit('auth-failure')
                        } else {
                            // something else
                            callback.abort()
                        }
                    })
                } else {
                    callback.selected(null)
                }
            }
        },
        mounted() {
            let inventoryId = this.$route.params.inventoryId
            if(inventoryId) {
                this.$refs.inventory.triggerLoadSelected()
            }
        },
        watch: {
            $route(to, from) {
                let fromId = from.params.inventoryId
                let toId = to.params.inventoryId
                let selectedId = this.$refs.inventory.getSelectedId()
                if(fromId!==toId && toId!=selectedId) {
                    this.$refs.inventory.triggerLoadSelected()
                }
            }
        }
    }
</script>

<template>
    <invetory
        ref="inventory"
        label="Inventory"
        :get-items="getItems"
        :filter-items="filterItems"
        :delete-item="deleteItem"
        :delete-message="(item)=> `Are you sure you want to delete ${item.name}`"
        :load-selected="loadSelected" />
</template>
