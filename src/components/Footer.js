import styled from 'styled-components'
import ResponsiveImage from './ResponsiveImage';
import React from 'react';

import footerImage from '../images/moretrees-footer.jpg'

const Wrapper = styled.footer`
    height: 100px;
    position: absolute;
    bottom: 100px;
    width: 100%;
`

const ImageContainer = styled.div`
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
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