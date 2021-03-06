import React from 'react'

export default function EmailIcon({width, height, background}) {

    let svgWidth = width || '20'
    let svgHeight = height || '25'
    let svgBackground = background || '#60bc0f'

    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill={svgBackground} width={svgWidth} height={svgHeight} viewBox="0 0 20 20"><path d="M18 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h16zm-4.37 9.1L20 16v-2l-5.12-3.9L20 6V4l-10 8L0 4v2l5.12 4.1L0 14v2l6.37-4.9L10 14l3.63-2.9z" /></svg>
    )
}