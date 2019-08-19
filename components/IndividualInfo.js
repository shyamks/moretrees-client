import { useState } from 'react'
import styled from 'styled-components'

import Input from './Input'

function IndividualInfo(){
    return (
        <div>
            <div> What do you do?</div>
            <Input placeholder={'Industry'}/>
            <Input placeholder={'Role'}/>
        </div>
    )
}

export default IndividualInfo