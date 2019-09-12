import styled from 'styled-components'
import ResponsiveImage from './ResponsiveImage';

const Wrapper = styled.footer`
    margin-top: 50px;
`

const ImageContainer = styled.div`
    max-width: 400px;
    margin: auto;
`

const Image = styled.img`
width: 100%;
height: auto;
`

const footerImage = '/static/images/moretrees-footer.jpg'

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