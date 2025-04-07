// colorBarUtils.ts

import * as d3 from 'd3'

export interface ColorBarOptions {
  width: number
  height: number
  colorScheme: string | string[]
  domain: number[]
}

export const createColorBar = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  options: ColorBarOptions
) => {
  const { width, height, colorScheme, domain } = options

  // Increase the SVG height to accommodate the icon
  svg.attr('width', width + 20).attr('height', height + 100)
  svg.selectAll('*').remove() // Clear previous contents

  let colorScale: d3.ScaleLinear<number, number> | d3.ScaleLinear<string, string>
  let colorInterpolator: ((t: number) => string) | undefined

  if (typeof colorScheme === 'string') {
    colorInterpolator = (d3 as any)[colorScheme]
    colorScale = d3.scaleLinear<number, number>().domain(domain).range([0, 1])
  } else {
    colorScale = d3.scaleLinear<string, string>().domain(domain).range(colorScheme)
  }

  const linearGradient = svg.append('defs').append('linearGradient').attr('id', 'linear-gradient')

  linearGradient
    .selectAll('stop')
    .data(
      colorScale.ticks().map((t, i, n) => ({
        offset: `${(100 * i) / (n.length - 1)}%`,
        color:
          typeof colorScheme === 'string'
            ? colorInterpolator!(colorScale(t) as number)
            : (colorScale(t) as string),
      }))
    )
    .enter()
    .append('stop')
    .attr('offset', (d) => d.offset)
    .attr('stop-color', (d) => d.color)

  svg
    .append('rect')
    .attr('x', 10)
    .attr('y', 10)
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'url(#linear-gradient)')

  const xAxis = d3
    .axisBottom(
      d3
        .scaleLinear()
        .domain([domain[0], domain[domain.length - 1]])
        .range([10, width + 10])
    )
    .ticks(5)

  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${height + 10})`)
    .call(xAxis)

  // Add the icon under the bar
  const iconWidth = 30 
  const iconHeight = 30 

  svg
    .append('image')
    .attr('xlink:href', '/charging-station.png')
    .attr('x', (width + 20) / 2 - iconWidth / 2)
    .attr('y', height + 50)
    .attr('width', iconWidth)
    .attr('height', iconHeight)
}
