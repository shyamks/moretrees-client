import styled from 'styled-components'

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

    &:focus {
        border-color: #60bc0f;
        transition: border-color 0.3s ease-in-out;

        ${({ error }) => error && `
        border-color: red;
        `}
    }
`

export default Input;