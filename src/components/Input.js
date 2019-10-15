import styled from 'styled-components'
import React from 'react'

const Container = styled.div`
    position: relative;
    line-height: 14px;
    margin:0 10px;
    display: flex;
`

const Label = styled.label`
    left: 14px;
    top: 30px;
    font-size: 13px;
    color: grey;
    position: absolute;
    z-index: 2;
    display: block;
    background: white;
    pointer-events: none;
    padding: 0 2px;
    transition: all 100ms ease;
`

const Input = styled.input`
    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    }
    display: block;
    outline: none;
    font-size: 16px;
    font-weight: 500;
    -webkit-appearance: none;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    background-color: #fff;
    border: ${(props) => (props.option === true ? '0px' : '')};
    line-height: 30px;
    /* vertical-align: middle; */
    height: 33px;
    width: ${(props) => (props.numberInputWidth)};
    padding: 0 8px;
    margin-left: 5px;
    margin-top: 20px;
    transition: border-color 0.3s ease-in-out;
    ${({ error }) => error && `border-color: red;`}

    &:valid {
        + ${Label} {
            transform: translateY(-18px);
            color:  ${({ error }) => error ? 'red' : 'grey'};


            font-size: 10px;
        }
    }
    

    &:focus {
        border-color: #60bc0f;
        transition: border-color 0.3s ease-in-out;

        
        + ${Label} {
            transform: translateY(-18px);
            color: #60bc0f;
            font-size: 10px;
        }
    }

    
`

const DEFAULT_LENGTH = "80"

export default function InputWithLabel({ placeholder, value, onBlur, onChange, isError, maxLength, id, ...otherProps }) {

    return (
        <Container>
            <Input id={id} onBlur={(e) => {
                e.persist()
                onBlur && onBlur(e)
            }}
            onChange={(e) => {
                e.persist()
                onChange && onChange(e)
            }}
                value={value}
                error={isError}
                {...otherProps} maxLength={maxLength || DEFAULT_LENGTH} required/>
            <Label for={id}>{placeholder}</Label>
        </Container>
    )
}

// export default Input;