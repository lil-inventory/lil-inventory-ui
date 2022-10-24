<script>
    export default {
        data() {
            return {
                name: null,
                barcode: null,
                group: '/root'
            }
        },
        methods: {
            _submit: function(event, inventoryId=this.$route.params.inventoryId, groupId=this.$route.params.groupId, name=this.name, barcode=this.barcode) {
                console.log(`create asset: inventory='${inventoryId}' group=${groupId}, name=${name}, barcode=${barcode}`)
                this.$client.createAsset(inventoryId, groupId, name, barcode)
            }
        }
    }
</script>

<template>
    <q-page class="flex flex-center">
        <q-input outlined v-model="name" label="Name" />
        <q-input outlined v-model="barcode" label="Barcode" />
        <q-input outlined v-model="group" label="Group" disable />
        <q-btn @click="_submit" unelevated color="primary" label="Submit"  />
    </q-page>
</template>

  