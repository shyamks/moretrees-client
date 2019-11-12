import React from 'react';
import styled from 'styled-components'
  
import footerImage from '../images/moretrees-footer.jpg'
import instagramSvg from '../images/instagram.svg'
import facebookSvg from '../images/facebook.svg'
import twitterSvg from '../images/twitter.svg'

const Wrapper = styled.footer`
    height: 100px;
    position: absolute;
    bottom: 100px;
    width: 100%;
`

const FooterContainer = styled.div`
    max-width: 400px;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
`

const Image = styled.img`
    width: 100%;
    height: auto;

`

const FooterPara = styled.p`
    font-size: 18px;
    font-weight: bolder;
`

const SocialIconsContainer = styled.div`
    justify-content: center;
    display: flex;
`

const SocialIcon = styled.a`
    margin: 0 8px 0 8px;
`

function Footer({ footerFixed }) {

    return (
        <Wrapper>
            <FooterContainer>
                <FooterPara>
                    {'Live in Bangalore, Mumbai, Nasik & Gurgoan'}<br />
                </FooterPara>
                <SocialIconsContainer>
                    <SocialIcon href={'https://www.instagram.com'} target="_blank"><img width={30} height={30} src={instagramSvg} /></SocialIcon>
                    <SocialIcon href={'https://www.facebook.com'} target="_blank"><img width={30} height={30} src={facebookSvg} /></SocialIcon>
                    <SocialIcon href={'https://www.twitter.com'} target="_blank"><img width={30} height={30} src={twitterSvg} /></SocialIcon>
                </SocialIconsContainer>
            </FooterContainer>
        </Wrapper>
    )
}

export default Footer