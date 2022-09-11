<script>
    export default {
        data() {
            return {
                loading: false,
                show: false,
                email: '',
                password: '',
                error: ''
            }
        },
        methods: {
            onSubmit: function() {
                this.loading = true

                this.$client.login(this.email, this.password)
                .then((response) => {
                    console.log(response)
                    if(response.status===200) {
                        this.error = ''
                        this.show = false
                    } else if(response.status===401 || response.status===403) {
                        this.error = 'Authentication Failed'
                        console.error(response)
                    } else {
                        this.error = 'Unknown Error'
                        console.error(response)
                    }
                })
                .catch((error) => {
                    this.error = 'Unknown Error'
                    console.error(error)
                })
                .finally(() => {
                    this.loading = false
                    this.password = ''
                })
            },
            open: function(error) {
                this.show = true
                this.error = error
            }
        },
        watch: {
            show(val) {
                if(val==true) {
                    this.email = ''
                    this.password = ''
                }
            }
        }
    }
</script>

<template>
    <q-dialog v-model="show" persistent class="login">
        <q-card :style="{cursor: loading ? 'not-allowed' : 'default'}">
            <q-card-section>
                <div style="display:table; width: 100%;">
                    <div style="display:table-row">
                        <div class="text-h6"  style="display:table-cell; float: left;">Login</div>
                        <div style="display:table-cell; float: right;" :style="{visibility: loading ? 'visible' : 'hidden'}"><q-spinner color="primary" size="2em" :thickness="8" /></div>
                    </div>
                    <div style="display:table; width: 100%; text-align: center; color: red; height: 1.5em;">
                        {{error}}
                    </div>
                </div>
            </q-card-section>

            <q-card-section class="items-center">
                <div class="table" style="display:table">
                    <div style="display:table-row">
                        <div style="display:table-cell; width: 48px">
                            <q-avatar square icon="perm_identity" color="primary" text-color="white"  />
                        </div>
                        <div style="display:table-cell">
                            <q-input :disable="loading" v-model="email" label="Email" />
                        </div>
                    </div>
                    <div style="display:table-row">
                        <div style="display:table-cell; width: 48px">
                            <q-avatar square icon="lock" color="primary" text-color="white" />
                        </div>
                        <div style="display:table-cell">
                            <q-input :disable="loading" v-model="password" label="Password" type="password" />
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn :disable="loading" flat label="Submit" color="primary" @click="onSubmit" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<style>
    .login .table {
        width: 95%;
    }
    .login .q-avatar {
        margin: 10px;
    }
    .login .q-card {
        width: 100%;
        min-width: 400px;
    }
</style>