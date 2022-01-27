<template>
  <div :class="['rmli-date']" @click="onClick">
        <div class="rmli-date-header">
            <div class="rmli-date-header-btn" @click.stop="onBack">
                <span class="rmli-common-valign-center">
                    <i class="ri-arrow-left-s-line"></i>
                </span>
            </div>
            <div class="rmli-date-header-label">
                <span class="rmli-common-valign-center">
                    {{dateLabel}}
                </span>
            </div>
            <div class="rmli-date-header-btn" @click.stop="onNext">
                <span class="rmli-common-valign-center">  
                    <i class="ri-arrow-right-s-line"></i>
                </span>
            </div>
        </div>
        <div class="rmli-date-body">
            <table>
                <tbody>
                     <tr>
                        <th v-for="d in day_names" :key="d" class="rmli-date-week-days">{{$t(d)}}</th>
                    </tr>
                    <tr v-for="(week, i) in body" :key="i">
                        <td v-for="(d, j) in week" 
                            :key="j" 
                            @click.stop="onSelect(d)" 
                            :class="[d.css, {'rmli-date-weekend': d.weekend}, {'rmli-date-workday': !d.weekend}]"
                        >
                            {{d.day}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
  </div>
</template>
<style lang="scss">
    @import '../scss/date-picker.scss';
</style>
<script>

import Logger from '../util/Logger'

export default {
  name: 'DatePicker',
  mixins: [],
  props: ['value'],
  emits: ['change', 'input'],
  data: function () {
      return {
          isRange: false,
          selected: new Date(),
          viewDate: new Date(),
          day_names: ['day.0', 'day.1', 'day.2', 'day.3', 'day.4', 'day.5', 'day.6']
      }
  },
  computed: {
      backLabel () {
          if (this.element && this.element.props.lastButtonLbl) {
              return '<'
          }
          return '-'
      },
      nextLabel () {
          if (this.element && this.element.props.nextButtonLbl) {
              return '>'
          }
          return '+'
      },
      dateLabel () {
          return this.$t('month.' + this.viewDate.getMonth()) + ' ' + this.viewDate.getFullYear()
      },
      selectedDate () {
          return this.selected;
      },
      body () {
        let year = this.viewDate.getFullYear()
        let month = this.viewDate.getMonth()
        let first = new Date(year, month , 1);
        let offset = first.getDay();
        let week = []
        let result = []
        // male 45 and filter empty last row
        for (let i = 0; i < 40; i++) {
            if (i % 7 == 0) {
                week = []
                result.push(week)
            }
            let day = {
                day: '',
                year: year,
                month: month,
                weekend: false
            }
            week.push(day)
            /**
             * Chekc if we are in current month
             */
            if (i - offset >= 0) {
                day.day = i - offset + 1 + '';
                var d1 = new Date(year, month, day.day);
                // check that we are not in next months
                if (d1.getMonth() != month) {
                    day.day = ''
                }
            }

            if (i % 7 == 0 || i % 7 == 6) {
                day.weekend = true
            }

            
            day.css = this.getSelectedCSS(day)
            
        }
        console.debug(result)
        return result
      }
  },
  methods: {
      getSelectedCSS (day) {
        if (this.isRange) {
            /**
             * Check if we have start range
             */
            if (this.selected.start) {
                let start = this.selected.start
                if (day.year === start.getFullYear() && day.month === start.getMonth() && day.day == start.getDate()) {
                    return 'rmli-date-range-start'
                }
            }

            /**
             * Check if end
             */
            if (this.selected.end) {
               let end = this.selected.end
               if (day.year === end.getFullYear() && day.month === end.getMonth() && day.day == end.getDate()) {
                    return 'rmli-date-range-end'
               }
            }

            /**
             * Check if between
             */
            if (this.selected.start && this.selected.end) {
                let dayMS = this.getMillis(day)
                let startMS = this.selected.start.getTime()
                let endMS  =this.selected.end.getTime()
                if (startMS < dayMS && dayMS < endMS) {
                    return 'rmli-date-range-middle'
                }
            }
          
        } else {
            let selected = this.selected
            if (day.year === selected.getFullYear() && day.month === selected.getMonth() && day.day == selected.getDate()) {
                return 'rmli-date-selected'
            }
        }
        return ''
      },
      getMillis (day) {
          return new Date(day.year, day.month, day.day).getTime()
      },
      onBack () {
        let date = this.viewDate
        let day = date.getDay()
        let month = date.getMonth()
        let year = date.getFullYear()
        month--;
        if (month < 0) {
            month = 11;
            year--;
        }
        this.setView(year, month, day)
      },
      onNext () {
        let date = this.viewDate
        let day = date.getDay()
        let month = date.getMonth()
        let year = date.getFullYear()
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
        this.setView(year, month, day)
      },
      setView (year, month, day) {
        this.viewDate = new Date(year, month, day)
      },
      onSelect (d) {
    
          if (this.isRange) {
            if (this.selected.end) {
                this.selected.start = new Date(d.year, d.month, d.day),
                this.selected.end = null
            } else {
                this.selected.end  = new Date(d.year, d.month, d.day)
                if (this.selected.start > this.selected.end) {
                    let help = this.selected.start
                    this.selected.start = this.selected.end
                    this.selected.end = help
                }
            }
          
            if (this.selected.end) {
                Logger.log(5, 'DatePicker.select() > range : ',  this.selected)
                if (this.element) {
                    this.onValueChange({
                        start: this.toIsoString(this.selected.start),
                        end: this.toIsoString(this.selected.end)
                    }, 'default')            
                } else {
                   
                    this.$emit('change', this.selected)
                    this.$emit('input', this.selected)
                }
            }

          } else {
            if (d.day !== '') {
                this.selected = new Date(d.year, d.month, d.day)
                 Logger.log(5, 'DatePicker.select() > date : ',  this.selected)
                if (this.element) {
                    /**
                     * Here is something wrong with UTC offsets
                     */
                    this.onValueChange(this.toIsoString(this.selected), 'default')
                } else {
                    this.$emit('change', this.selected)
                    this.$emit('input', this.selected)
                }
            } 
          }
      },
      toIsoString (date) {
          if (date) {
            let month = date.getMonth() + 1
            if (month < 10) {
                month = '0' + month
            }
            let day = date.getDate()
            if (day < 10) {
                day = '0' + day
            }
            return `${date.getFullYear()}-${month}-${day}`
          }
          return null
      },
      setDate (date) {
          this.viewDate = date
          this.selected = date
      }
  },
  watch: {
  },
  mounted () {
    if (this.value) {
        this.setDate(this.value) 
    }
    Logger.log(2,'DatePicker.mounted() > enter')
  }
}
</script>
