import React, { useState } from 'react'
import styled from 'styled-components'

import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { donationTypes } from '../constants';

const PhotoTimelineItem = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px 0 0 0;
`

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px 0 0 0;
`

const CaptionText = styled.p`
    text-align: center;
    justify-content: center;
`

export function MyTree({ myDonation }) {
    let { email, instaProfile, twitterProfile, type, title, subtitle, cost, content, treeId, status, photoTimeline } = myDonation
    const [carousel, setCarousel] = useState(() => {
        return {
            value: 0,
            slides: photoTimeline.map(item => {
                let { order, photoUrl, text } = item
                return (
                    <PhotoTimelineItem>
                        <img key={order} src={photoUrl} />
                        <p>{text}</p>
                    </PhotoTimelineItem>)
            })
        }
    })
    const onMove = (value) => {
        console.log(value,'value')
        setCarousel({ ...carousel, value })
    }
    
    return (
        <Container>
            <CaptionText>{`Your ${type === donationTypes[0].value ? ' riverside ' : ' roadside '}tree has been planted. `}</CaptionText>
            <Carousel slides={carousel.slides} value={carousel.value}/>
            <Dots value={carousel.value} onChange={onMove} number={carousel.slides.length} />
        </Container>
    )
}