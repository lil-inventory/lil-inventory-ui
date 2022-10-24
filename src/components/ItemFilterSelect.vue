<script>
import ConfirmDialog from './ConfirmDialog.vue'

export default {
    emits: ["item-select", "item-new", "item-delete"],
    components: {
      confirmDelete: ConfirmDialog
    },
    props: {

        /**
         * Label Text
         */
        label: String,

        /**
         * @param {String} item the item up for deletion
         * @return {String} The message to display
         */
        deleteMessage: Function,
        
        /**
         * Called to poll items when the button is clicked, before the menu opens
         * 
         * This method expects the callback to be called
         * 
         * @param {*} callback the callback used to define the items or cancel the request
         */
        getItems: Function,

        /**
         * Called to pull items when the user types in the filter
         * 
         * This method expects the callback to be called
         * 
         * @param {String} filter the current filter string
         * @param {*} callback the callback used to define the items or cancel the request
         */
        filterItems: Function,

        /**
         * Called when the user deletes an item. This will put the component into a loading
         * state.
         * 
         * This method expects the callback to be called
         * 
         * @param {String} item the item to delete
         * @param {String} filter the current filter string
         * @param {*} callback the callback used to define the items or cancel the request
         */
        deleteItem: Function,

        /**
         * Called to get the selected item. This may be called on load or when using the back and forward buttons
         * to figure out what item should be selected.
         * 
         * callback: {
         *   select(item) - Specifies the item to be selected. A null value unselects the item
         *   abort() - Aborts the process. The selected item will not change
         * }
         * 
         * @param {*} callback the callback used to define the new selected item
         */
        loadSelected: Function
    },
    data() {
        return {
            open: false,
            selected: null,
            filterText: null,
            items: [],
            loading: false
        }
    },
    methods: {
        /**
         * Return the current text in the filter
         */
        getFilterText() {
            return this.filterText
        },
        getSelectedId() {
            if(this.selected) {
                return this.selected.inventoryId
            }
        },
        /**
         * Triggers the load selected process.
         */
        triggerLoadSelected () {
            let self = this
            this.loading = true

            this.loadSelected({
                selected: function (selected) {
                    self.selected = selected
                    self.loading = false
                },
                abort: function () {
                    self.loading = false
                }
            })
        },
        _onButtonClick(e) {
            if (!this.open) {
                let self = this
                this.loading = true
                this.getItems({
                    update: function (items) {
                        self.items = items
                        self.loading = false
                        self.open = true
                    },
                    abort: function () {
                        self.loading = false
                        self.open = false
                    }
                })
            } else {
                this.open = false
            }
        },
        _onSelect(e, item) {
            this.selected = item;
            this.open = false;
            this.$emit("item-select", item)
        },
        _onNewInventory(e) {
            let filterText = this.filterText
            this.open = false
            this.$emit("item-new", filterText)
        },
        _onDeleteInventory(e, item) {
            e.stopPropagation()

            this._removeGlobalListener()

            let self = this
            this.$refs.confirmDelete.open({
                messageText: this.deleteMessage(item),
                onAccept: function() {
                    self.loading = true
                    self.deleteItem(item, self.filterText, {
                        update: function(items) {
                            self.items = items
                            self.loading = false
                        },
                        abort: function() {
                            // TODO error
                            self.loading = false
                        }
                    })
                    self.$emit("item-delete", item)
                },
                finally: function() {
                    setTimeout(() => { self._addGlobalListener(); }, 0);
                }
            })
            
        },
        _onFilterUpdate(model) {
            let self = this
            this.loading = true
            this.filterItems(this.filterText, {
                update: function (items) {
                    self.items = items
                    self.loading = false
                    self.open = true
                },
                abort: function () {
                    self.loading = false
                    self.open = false
                }
            })
        },
        _globalClickEventListener(e) {
            if (e.path.includes(this.$el)) {
                // ignore when clicked inside component
                return
            }

            // close when clicking outside of component
            this.open = false
        },
        _addGlobalListener() {
            document.documentElement.addEventListener('click', this._globalClickEventListener, false);
        },
        _removeGlobalListener() {
            document.documentElement.removeEventListener('click', this._globalClickEventListener, false)
        }
    },
    watch: {
        open: function (val) {
            if (val) {
                // add listener while open
                this._addGlobalListener()
            } else {
                // remove listener when closed
                this._removeGlobalListener()
                this.filterText = null
            }
        }
    }
}
</script>

<template>
    <div class="item-filter-select q-md row justify-center">
        <div v-ripple class="full-button relative-position container bg-primary text-white flex flex-center"
            @click="_onButtonClick">
            <div class="button">
                <div :class="{ label: true, compact: (open || selected!==null) }">{{ label }}</div>
                <div v-if="selected" class="selected">{{ selected.name }}</div>
            </div>
            <div v-if="!loading" class="arrow">
                <q-icon :class="{'arrow-ico': true, 'open': open}" name="M7,10L12,15L17,10H7Z" />
            </div>

            <div v-if="loading" class="spinner">
                <q-spinner color="white" size="2em" />
            </div>
        </div>

        <Transition name="popup">
            <div v-if="open" class="popup">
                <div class="table">
                    <div class="cell">
                        <q-input v-model="filterText" @update:model-value="_onFilterUpdate" rounded outlined dense
                            placeholder="Filter" bg-color="white">
                            <template v-slot:prepend>
                                <q-icon name="filter_alt" />
                            </template>
                        </q-input>
                    </div>
                    <div class="cell">
                        <q-btn flat size="sm" round icon="add" @click="_onNewInventory">
                            <q-tooltip transition-show="flip-right" transition-hide="flip-left" :delay="500"
                                anchor="center end" self="center start">Create New Inventory</q-tooltip>
                        </q-btn>
                    </div>
                </div>
                <q-list dense bordered padding class="rounded-borders">
                    <q-item v-for="item in items" clickable v-ripple @click="_onSelect($event, item)">
                        <q-item-section>
                            <q-item-label lines="1">{{ item.name }}</q-item-label>
                        </q-item-section>

                        <q-item-section>
                            <div style="display: table">
                                <div style="display: table-row; float: right;">
                                    <q-btn flat class="delete" size="xs" padding="xs" color="primary" icon="close"
                                        @click="_onDeleteInventory($event, item)">
                                        <q-tooltip transition-show="flip-right" transition-hide="flip-left" :delay="500"
                                            anchor="center end" self="center start">Delete</q-tooltip>
                                    </q-btn>
                                </div>
                            </div>
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>
        </Transition>
        <confirm-delete ref="confirmDelete" icon="delete" />
    </div>

</template>

<style>
.item-filter-select div.full-button {
    height: 50px;
    padding-right: 5px;
    padding-left: 5px;
    display: table;
    width: 100%;
    box-shadow: 0 0 10px 2px rgb(0 0 0 / 20%), 0 0px 10px rgb(0 0 0 / 24%);
    cursor: pointer;
}

.item-filter-select div.button {
    display: table-cell;
    text-align: left;
    width: 100%;
}

.item-filter-select .label {
    position: relative;
    top: 14px;
    font-size: 16px;
    font-weight: normal;
    letter-spacing: 0.01em;
    transition: all .36s cubic-bezier(.4, 0, .2, 1);
}

.item-filter-select .label.compact {
    top: 5px;
    font-size: 12px;
}

.item-filter-select div.arrow {
    position: relative;
    display: table-cell;
    vertical-align: middle;
    font-size: 1.715em;
    margin: auto;
}

.item-filter-select div.arrow .arrow-ico {
    transition: all .28s;
}

.item-filter-select div.arrow .arrow-ico.open {
    transform: rotate(180deg);
}

.item-filter-select div.spinner {
    display: table-cell;
    position: relative;
    padding-right: 8px;
    vertical-align: middle;
}

.item-filter-select .popup {
    background-color: white;
    width: 100%;
    position: absolute;
    box-shadow: 0 1px 5px #0003, 0 2px 2px #00000024, 0 3px 1px -2px #0000001f;
    border-radius: 4px;
    top: 50px;
    z-index: 1000;
}

.item-filter-select .popup .table {
    display: table;
    width: 100%;
    background-color: lightblue;
}

.item-filter-select .popup .table .cell {
    display: table-cell;
    vertical-align: middle;
    padding: 5px 2.5px 5px 2.5px;
}

.item-filter-select .popup .table button {
    color: lightslategrey;
}

.popup-enter-active,
.popup-leave-active {
    transition: opacity .36s cubic-bezier(.4, 0, .2, 1);
}

.popup-enter-from,
.popup-leave-to {
    opacity: 0;
}
</style>
