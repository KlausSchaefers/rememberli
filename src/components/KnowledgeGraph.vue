<template>
  <div class="rmli-knowledge-graph">

    <div class="rmli-knowledge-graph-controls" v-if="tagNodes.length > 0">
      <i class="ri-zoom-in-line" @click="zoomIn"></i>
      <i class="ri-zoom-out-line" @click="zoomOut"></i>
      <i class="ri-focus-3-line" @click="resetView"></i>
    </div>

    <svg
      v-if="tagNodes.length > 0"
      class="rmli-knowledge-graph-svg"
      :viewBox="'0 0 ' + viewBoxSize + ' ' + viewBoxSize"
      preserveAspectRatio="xMidYMid meet"
      @wheel="onWheel"
      @mousedown="startPan"
      ref="svg"
    >
      <g class="rmli-knowledge-graph-viewport" :transform="viewportTransform">
        <line
          v-for="(edge, index) in edges"
          :key="index"
          :x1="edge.from.x"
          :y1="edge.from.y"
          :x2="edge.to.x"
          :y2="edge.to.y"
          class="rmli-knowledge-graph-edge"
        />

        <g
          v-for="note in noteNodes"
          :key="note.id"
          class="rmli-knowledge-graph-node rmli-knowledge-graph-node-note"
          :transform="'translate(' + note.x + ',' + note.y + ')'"
        >
          <circle :r="note.radius"/>
          <foreignObject :x="-note.radius / 2" :y="-note.radius / 2" :width="note.radius" :height="note.radius">
            <i xmlns="http://www.w3.org/1999/xhtml" class="ri-sticky-note-line"></i>
          </foreignObject>
        </g>

        <g
          v-for="tag in tagNodes"
          :key="tag.label"
          :class="['rmli-knowledge-graph-node', 'rmli-knowledge-graph-node-tag', {'rmli-knowledge-graph-node-person': tag.type === 'person'}]"
          :transform="'translate(' + tag.x + ',' + tag.y + ')'"
          @click="selectTag(tag)"
        >
          <circle :r="tag.radius"/>
          <foreignObject :x="-tag.radius / 2" :y="-tag.radius / 2" :width="tag.radius" :height="tag.radius">
            <i xmlns="http://www.w3.org/1999/xhtml" :class="tag.type === 'person' ? 'ri-user-line' : 'ri-price-tag-3-line'"></i>
          </foreignObject>
          <text text-anchor="middle" :dy="-(tag.radius + 6)">{{tag.label}}</text>
        </g>
      </g>
    </svg>
    <p class="rmli-knowledge-graph-empty" v-else>{{$t('graph.empty')}}</p>
  </div>
</template>
<style lang="scss">
  @use '../scss/knowledge-graph.scss';
</style>

<script>

const MIN_ZOOM = 0.25
const MAX_ZOOM = 4
const DRAG_THRESHOLD = 3

const VIEW_SIZE = 400
const CENTER = VIEW_SIZE / 2
const TAG_RING_RADIUS = VIEW_SIZE * 0.35
const NOTE_RING_RADIUS = VIEW_SIZE * 0.17
const TAG_BASE_RADIUS = VIEW_SIZE * 0.0125
const TAG_RADIUS_STEP = VIEW_SIZE * 0.0025
const TAG_MAX_COUNT_STEPS = 4
const NOTE_RADIUS = VIEW_SIZE * 0.0125

export default {
  name: 'KnowledgeGraph',
  props: ['elements'],
  emits: ['search'],
  data: function () {
    return {
      zoom: 1,
      pan: {x: 0, y: 0},
      isPanning: false,
      hasDragged: false,
      panStart: {x: 0, y: 0},
      panOrigin: {x: 0, y: 0}
    }
  },
  computed: {
    viewBoxSize () {
      return VIEW_SIZE
    },
    viewportTransform () {
      return `translate(${this.pan.x}, ${this.pan.y}) scale(${this.zoom})`
    },
    tagStats () {
      const stats = new Map()
      const elements = this.elements || []
      elements.forEach(e => {
        (e.tags || []).forEach(tag => {
          if (!tag || !tag.v) {
            return
          }
          if (!stats.has(tag.v)) {
            stats.set(tag.v, {label: tag.v, type: tag.t, count: 0})
          }
          stats.get(tag.v).count++
        })
      })
      return Array.from(stats.values())
    },
    tagNodes () {
      const count = this.tagStats.length
      return this.tagStats.map((tag, index) => {
        const angle = (index / count) * Math.PI * 2
        return {
          ...tag,
          x: CENTER + Math.cos(angle) * TAG_RING_RADIUS,
          y: CENTER + Math.sin(angle) * TAG_RING_RADIUS,
          radius: TAG_BASE_RADIUS + Math.min(tag.count, TAG_MAX_COUNT_STEPS) * TAG_RADIUS_STEP
        }
      })
    },
    noteNodes () {
      const notes = (this.elements || []).filter(e => e.tags && e.tags.length > 0)
      const count = notes.length
      return notes.map((note, index) => {
        const angle = (index / count) * Math.PI * 2
        return {
          id: note.id,
          tags: note.tags,
          radius: NOTE_RADIUS,
          x: CENTER + Math.cos(angle) * NOTE_RING_RADIUS,
          y: CENTER + Math.sin(angle) * NOTE_RING_RADIUS
        }
      })
    },
    edges () {
      const tagPositions = new Map(this.tagNodes.map(tag => [tag.label, tag]))
      const result = []
      this.noteNodes.forEach(note => {
        (note.tags || []).forEach(tag => {
          const target = tagPositions.get(tag.v)
          if (target) {
            result.push({from: {x: note.x, y: note.y}, to: {x: target.x, y: target.y}})
          }
        })
      })
      return result
    }
  },
  methods: {
    selectTag (tag) {
      if (this.hasDragged) {
        return
      }
      this.$emit('search', ':' + tag.label)
    },
    onWheel (e) {
      e.preventDefault()
      const factor = e.deltaY > 0 ? 0.9 : 1.1
      this.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.zoom * factor))
    },
    zoomIn () {
      this.zoom = Math.min(MAX_ZOOM, this.zoom * 1.2)
    },
    zoomOut () {
      this.zoom = Math.max(MIN_ZOOM, this.zoom / 1.2)
    },
    resetView () {
      this.zoom = 1
      this.pan = {x: 0, y: 0}
    },
    getViewBoxScale () {
      const rect = this.$refs.svg.getBoundingClientRect()
      // "meet" fits the viewBox using the smaller of the two ratios
      return Math.min(rect.width, rect.height) / VIEW_SIZE
    },
    startPan (e) {
      this.isPanning = true
      this.hasDragged = false
      this.panStart = {x: e.clientX, y: e.clientY}
      this.panOrigin = {...this.pan}
      this.panScale = this.getViewBoxScale()
      this.moveHandler = (ev) => this.movePan(ev)
      this.upHandler = () => this.endPan()
      window.addEventListener('mousemove', this.moveHandler)
      window.addEventListener('mouseup', this.upHandler)
    },
    movePan (e) {
      if (!this.isPanning) {
        return
      }
      const dx = (e.clientX - this.panStart.x) / this.panScale
      const dy = (e.clientY - this.panStart.y) / this.panScale
      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
        this.hasDragged = true
      }
      this.pan = {x: this.panOrigin.x + dx, y: this.panOrigin.y + dy}
    },
    endPan () {
      this.isPanning = false
      window.removeEventListener('mousemove', this.moveHandler)
      window.removeEventListener('mouseup', this.upHandler)
    }
  },
  beforeUnmount () {
    this.endPan()
  }
}
</script>
