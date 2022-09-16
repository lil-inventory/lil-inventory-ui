<script>
import { ref } from 'vue'

export default {
    emits: ['select', 'auth-failure'],
    data() {
        return {
            selected: null,
            inventories: []
        }
    },
    setup (props, { emit }) {
        const options = ref(props.opts)

        return {
            model: '',
            options
        }
    },
    methods: {
        abortFilterFn: function () {
            // console.log('delayed filter aborted')
        },
        filterFn (val, update, abort) {
            this.$client.getInventories().then(r => {
                if(r.status===200) {
                    // ok
                    update(() => this.inventories = r.body)
                } else if(r.status===401 || r.status===403) {
                    // auth issue
                    abort()
                    this.$emit('auth-failure')
                } else {
                    // something else
                    abort()
                }
            })
        }
    },
    watch: {
        selected(val, old) {
            if(val && val!==old) {
                this.$emit('select', val)
            }
        }
    }
}
</script>

<template>
    <div class="inventory">
        <q-select
            filled
            square
            v-model="selected"
            autofocus
            input-debounce="0"
            label="Inventory"
            :options="inventories"
            :option-label="(option)=>option.name"
            options-dense
            @filter="filterFn"
            bg-color="primary"
            label-color="grey-5"
            color="grey-5"
            options-selected-class="inventory-selected"
            popup-content-class="inventory-popup"
            >

            <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-grey">
                        No results
                    </q-item-section>
                </q-item>
            </template>

            <template v-slot:selected-item="item">
                <span>{{ item.opt.name }}</span>
            </template>
        </q-select>
    </div>
</template>

<style>
.inventory-popup {
    background-color: #6b9dcf;
}

.inventory {
    box-shadow: 0 0 10px 2px rgb(0 0 0 / 20%), 0 0px 10px rgb(0 0 0 / 24%);
}

.inventory-selected {
    color: red;
}

.inventory .q-field__control {
    min-height: 50px;
    height: 50px;
}

.inventory .q-field__control span {
    color: white;
}

.inventory .q-icon {
    color: white;
}
</style>