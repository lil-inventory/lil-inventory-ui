<script>
    export default {
        data() {
            return {
                confirm: false,
                _icon: null,
                _messageText: null,
                _cancelText: null,
                _acceptText: null,
                _onCancel: null,
                _onAccept: null
            }
        },
        props: {
            icon: String,
            messageText: String,
            cancelText: String,
            acceptText: String
        },
        methods: {
            /**
             * 
             * @param {{icon: String, messageText: String, cancelText: String, acceptText: String, onCancel: Function, onAccept: Function}} data 
             */
            open(data) {
                this._icon = data.icon ? data.icon : (this.icon ? this.icon : "warning")
                this._messageText = data.messageText ? data.messageText : (this.messageText ? this.messageText : "Confirmation Requested")
                this._cancelText = data.cancelText ? data.cancelText : (this.cancelText ? this.cancelText : "Cancel")
                this._acceptText = data.acceptText ? data.acceptText : (this.acceptText ? this.acceptText : "Accept")
                this._onCancel = data.onCancel
                this._onAccept = data.onAccept
                this.confirm = true
            },
            _onYes: function() {
                let accept = this._onAccept
                
                this.confirm = false
                this._messageText = null
                this._onCancel = null
                this._onAccept = null

                if(accept) accept()
            },
            _onNo: function() {
                let cancel = this._onCancel
                
                this.confirm = false
                this._messageText = null
                this._onCancel = null
                this._onAccept = null

                if (cancel) cancel()
            }
        }
    }
</script>

<template>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar :icon="_icon" color="primary" text-color="white" />
          <span class="q-ml-sm">{{_messageText}}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="_cancelText" color="primary" v-close-popup @click="_onNo" />
          <q-btn flat :label="_acceptText" color="primary" v-close-popup @click="_onYes" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
