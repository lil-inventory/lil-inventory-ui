<script>
    export default {
        emits: ['new-group', 'new-asset'],
        props: {
            disabled: Boolean
        }
    }
</script>

<template>
    <q-btn @click="()=>$emit('new-group')" unelevated icon="add" color="primary" label="Group" size="sm" style="width: calc(50% - 4px); margin: 2px;" :disable="disabled" >
        <q-tooltip transition-show="flip-up" transition-hide="flip-down" :delay="500" anchor="top middle" self="center middle" :offset="[0, 20]">Create New Group</q-tooltip>
    </q-btn>
    <q-btn @click="()=>$emit('new-asset')" unelevated icon="add" color="primary" label="Asset" size="sm" style="width: calc(50% - 4px); margin: 2px;" :disable="disabled" >
        <q-tooltip transition-show="flip-up" transition-hide="flip-down" :delay="500" anchor="top middle" self="center middle" :offset="[0, 20]">Create New Asset</q-tooltip>
    </q-btn>
</template>