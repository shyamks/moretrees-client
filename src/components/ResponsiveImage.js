import styled from 'styled-components'
import React from 'react'

function ResponsiveImage({ src, width, height }) {
    const ImageContainer = styled.div`
    // width: ${width}
    position: relative;
    max-width: 100%;
   `

    const InnerContainer = styled.div`
    // padding-bottom: ${height / width * 100}%
   `
    const Image = styled.img`
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    // height: 40%;
   `
    return (
        <ImageContainer>
            <InnerContainer />
            <Image src={src} />
        </ImageContainer>
    );
}

export default ResponsiveImage

// ReactDOM.render(
//     <ResponsiveImage
//         src="https://lorempixel.com/1200/800/"
//         width={1200}
//         height={800} />,
//     document.getElementById('app')
// );