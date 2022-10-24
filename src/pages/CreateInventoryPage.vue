<script>
    export default {
        data() {
            return {
                name: ''
            }
        },
        methods: {
            _submit: function(event, groupId=this.$route.params.groupId, name=this.name) {
                console.log(`create inventory: name='${name}'`)
                this.$client.createInventory(name, groupId)
            }
        }
    }
</script>

<template>
    <q-page class="flex flex-center">
        <q-input outlined v-model="name" label="Name" />
        <q-btn @click="_submit" unelevated color="primary" label="Submit"  />
    </q-page>
</template>

  