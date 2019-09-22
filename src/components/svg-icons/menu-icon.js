import React from 'react'

export default function Icon({width, height, background}) {

    let svgWidth = width || '20'
    let svgHeight = height || '25'
    let svgBackground = background || 'black' || '#60bc0f'

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={svgWidth} height={svgHeight} background={svgBackground} viewBox="0 0 20 20"><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
    )
}