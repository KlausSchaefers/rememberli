<template>
  <RDialog ref="dialog">
      <div class="rmli-settings">



        <div  class="rmli-dialog-content-m" >
            <h1 class="rmli-margin-top-l">{{$t('code.dialogTitle')}}</h1>
            <div class="rmli-code-variables">
              <div v-for="variable in vars" :key="variable" class="rmli-code-variable">
                <label class="rmli-code-variable-name">{{getVariableName(variable)}}</label>
                <input type="text" v-model="replacements[variable]" class="rmli-code-variable-input" ref="inputs"/>

              </div>
            </div>
     
        </div>

        

        <div class="rmli-button-bar">
            <button class="rmli-button" @click="save">{{$t('common.copy')}}</button>
            <button class="rmli-button rmli-button-secondary " @click="cancel">{{$t('common.cancel')}}</button>
        </div>
      </div>
  </RDialog>
</template>

<style lang="scss">
  @use '../scss/tab.scss';
  @use '../scss/code_variable.scss';
</style>
<script>

import RDialog from '../common/Dialog.vue'
import Logger from '../util/Logger'

export default {
  name: 'CodeVariableDialog',
  emits: [],
  props: [],
  data: function () {
    return {
        vars: null
    }
  },
  components: {
    RDialog
  },
  methods: {
    getVariableName (variable) {
      const parts = variable.substring(1, variable.length - 1).split(':')
      return parts[0]
    },
    onChange (e) {
      Logger.log(-1, 'CodeVariableDialog.onChange()')
      this.settings = e
    },
    show (vars, callback) {
      Logger.log(-1, 'CodeVariableDialog.show()')
      this.callback = callback
      this.vars = vars
      this.replacements = {}
      
      // Load previously saved values from localStorage
      vars.forEach(variable => {
        const varName = this.getVariableName(variable)
        const savedValue = localStorage.getItem(`codevar_${varName}`)
        if (savedValue) {
          this.replacements[variable] = savedValue
        }
      })
      
      this.$refs.dialog.show()
      setTimeout(() => {
        if (this.$refs.inputs && this.$refs.inputs.length > 0) {
          this.$refs.inputs[0].focus()
        }
      }, 100)
    },
    save () {
      Logger.log(-1, 'CodeVariableDialog.save()')
      
      // Save values to localStorage
      if (this.replacements) {
        Object.keys(this.replacements).forEach(variable => {
          const varName = this.getVariableName(variable)
          localStorage.setItem(`codevar_${varName}`, this.replacements[variable])
        })
      }
      
      if (this.callback && this.replacements) {
        this.callback(this.replacements)
      }
      this.close()
    },
    cancel () {
      Logger.log(-1, 'CodeVariableDialog.cancel()')
      this.close()
    },
    close () {
      this.selected = null
      this.$refs.dialog.close()
    }
  },
  mounted () {
  }
}
</script>
