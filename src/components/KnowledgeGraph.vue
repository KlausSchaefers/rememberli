<template>
  <div class="rmli-knowledge-graph">
    <div class="rmli-knowledge-graph-controls" v-if="hasData">
      <i class="ri-zoom-in-line" @click="zoomBy(1.3)"></i>
      <i class="ri-zoom-out-line" @click="zoomBy(1 / 1.3)"></i>
      <i class="ri-focus-3-line" @click="resetZoom"></i>
    </div>
    <div class="rmli-knowledge-graph-canvas" ref="canvas" v-show="hasData"></div>
    <p class="rmli-knowledge-graph-empty" v-if="!hasData">{{$t('graph.empty')}}</p>
  </div>
</template>
<style lang="scss">
  @use '../scss/knowledge-graph.scss';
</style>

<script>
import * as d3 from 'd3'

export default {
  name: 'KnowledgeGraph',
  props: ['elements'],
  emits: ['search'],
  data: function () {
    return {
      hasData: false
    }
  },
  computed: {
    graphData () {
      const tagIndex = new Map()
      const nodes = []
      const links = []
      const elements = this.elements || []
      elements.forEach(e => {
        const tags = (e.tags || []).filter(tag => tag && tag.v)
        if (tags.length === 0) {
          return
        }
        const noteId = 'note:' + e.id
        nodes.push({id: noteId, type: 'note'})
        tags.forEach(tag => {
          const tagId = 'tag:' + tag.v
          if (!tagIndex.has(tagId)) {
            tagIndex.set(tagId, {id: tagId, type: 'tag', label: tag.v, tagType: tag.t})
            nodes.push(tagIndex.get(tagId))
          }
          links.push({source: noteId, target: tagId})
        })
      })
      return {nodes, links}
    }
  },
  watch: {
    graphData (data) {
      this.hasData = data.nodes.length > 0
      this.updateGraph(data)
    }
  },
  methods: {
    nodeRadius (d) {
      return d.type === 'tag' ? 10 : 8
    },
    measure () {
      const rect = this.$refs.canvas.getBoundingClientRect()
      return {width: rect.width || 600, height: rect.height || 400}
    },
    zoomBy (factor) {
      this.svg.transition().duration(200).call(this.zoomBehavior.scaleBy, factor)
    },
    resetZoom () {
      this.svg.transition().duration(200).call(this.zoomBehavior.transform, d3.zoomIdentity)
    },
    selectTag (d) {
      this.$emit('search', ':' + d.label)
    },
    drag (simulation) {
      const dragstarted = (event, d) => {
        if (!event.active) {
          simulation.alphaTarget(0.3).restart()
        }
        d.fx = d.x
        d.fy = d.y
      }
      const dragged = (event, d) => {
        d.fx = event.x
        d.fy = event.y
      }
      const dragended = (event, d) => {
        if (!event.active) {
          simulation.alphaTarget(0)
        }
        d.fx = null
        d.fy = null
      }
      return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
    },
    initGraph () {
      const {width, height} = this.measure()

      this.svg = d3.select(this.$refs.canvas)
        .append('svg')
        .attr('class', 'rmli-knowledge-graph-svg')

      this.svg.append('defs').append('marker')
        .attr('id', 'rmli-graph-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('class', 'rmli-knowledge-graph-arrow-head')
        .attr('d', 'M0,-5L10,0L0,5')

      this.viewport = this.svg.append('g').attr('class', 'rmli-knowledge-graph-viewport')
      this.linkSelection = this.viewport.append('g').attr('class', 'rmli-knowledge-graph-links').selectAll('line')
      this.nodeSelection = this.viewport.append('g').attr('class', 'rmli-knowledge-graph-nodes').selectAll('g')

      this.simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.id).distance(80))
        .force('charge', d3.forceManyBody().strength(-260))
        .force('x', d3.forceX(width / 2))
        .force('y', d3.forceY(height / 2))
        .force('collide', d3.forceCollide().radius(d => this.nodeRadius(d) + 12))
        .on('tick', () => this.onTick())

      this.zoomBehavior = d3.zoom()
        .scaleExtent([0.25, 4])
        .on('zoom', (event) => this.viewport.attr('transform', event.transform))
      this.svg.call(this.zoomBehavior)

      this.resizeHandler = () => this.onResize()
      window.addEventListener('resize', this.resizeHandler)
    },
    onResize () {
      if (!this.simulation) {
        return
      }
      const {width, height} = this.measure()
      this.simulation.force('x', d3.forceX(width / 2))
      this.simulation.force('y', d3.forceY(height / 2))
      this.simulation.alpha(0.3).restart()
    },
    onTick () {
      this.linkSelection
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      this.nodeSelection.attr('transform', d => `translate(${d.x},${d.y})`)
    },
    updateGraph (data) {
      if (!this.simulation) {
        return
      }

      // Keep existing x/y/vx/vy so nodes that survive an update don't jump (d3 general update pattern)
      const oldPositions = new Map(this.simulation.nodes().map(d => [d.id, d]))
      const nodes = data.nodes.map(d => Object.assign({}, oldPositions.get(d.id), d))
      const links = data.links.map(d => Object.assign({}, d))

      this.linkSelection = this.linkSelection
        .data(links, d => d.source + '>' + d.target)
        .join(enter => enter.append('line')
          .attr('class', 'rmli-knowledge-graph-edge')
          .attr('marker-end', 'url(#rmli-graph-arrow)')
        )

      this.nodeSelection = this.nodeSelection
        .data(nodes, d => d.id)
        .join(enter => {
          const g = enter.append('g')
            .attr('class', d => [
              'rmli-knowledge-graph-node',
              'rmli-knowledge-graph-node-' + d.type,
              d.tagType === 'person' ? 'rmli-knowledge-graph-node-person' : ''
            ].join(' '))
            .call(this.drag(this.simulation))
            .on('click', (event, d) => {
              if (d.type === 'tag') {
                this.selectTag(d)
              }
            })
          g.append('circle').attr('r', d => this.nodeRadius(d))
          g.filter(d => d.type === 'note')
            .append('foreignObject')
            .attr('class', 'rmli-knowledge-graph-icon')
            .attr('x', d => -this.nodeRadius(d))
            .attr('y', d => -this.nodeRadius(d))
            .attr('width', d => this.nodeRadius(d) * 2)
            .attr('height', d => this.nodeRadius(d) * 2)
            .append('xhtml:i')
            .attr('class', 'ri-file-text-line')
          g.append('text')
            .attr('class', 'rmli-knowledge-graph-label')
            .attr('text-anchor', 'middle')
            .attr('dy', d => -(this.nodeRadius(d) + 6))
            .text(d => d.type === 'tag' ? d.label : '')
          return g
        })

      this.simulation.nodes(nodes)
      this.simulation.force('link').links(links)
      this.simulation.alpha(0.6).restart()
    }
  },
  mounted () {
    this.initGraph()
    this.hasData = this.graphData.nodes.length > 0
    this.updateGraph(this.graphData)
  },
  beforeUnmount () {
    if (this.simulation) {
      this.simulation.stop()
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
    }
    if (this.svg) {
      this.svg.remove()
    }
  }
}
</script>
