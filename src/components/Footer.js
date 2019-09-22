import styled from 'styled-components'
import ResponsiveImage from './ResponsiveImage';
import React from 'react';

import footerImage from '../images/moretrees-footer.jpg'

const Wrapper = styled.footer`
    margin-top: 20px;
    // position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    color: white;
    text-align: center;
`

const ImageContainer = styled.div`
    max-width: 400px;
    margin: auto;
`

const Image = styled.img`
    width: 100%;
    height: auto;
`


function Footer({ footerFixed }) {

    return (
        <Wrapper>
            <ImageContainer>
                <Image src={footerImage} />
            </ImageContainer>
        </Wrapper>
    )
}

export default Footer