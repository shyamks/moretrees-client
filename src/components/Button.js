import styled from 'styled-components'

const Button = styled.button`
    margin: 20px;
    font-size: 16px;
    font-weight: 500;
    // border: 1px solid #60bc0f;
    color: ${(props) => (props.color ? props.color : 'white')};
    border-radius: 5px;
    border-width: 0px;
    background-color: ${(props) => props.disabled ? 'grey' : '#60bc0f'};
    height: ${(props) => (props.height ? props.height : '33px')};
    width: ${(props) => (props.width ? props.width : '100px')};
    &: hover{
        cursor: pointer;
        border: 1px solid #60bc0f;
        background-color: transparent;
    }
    &: active {
        outline: none;
        border: none;
    }
    &: focus {
        outline: none;
    }
`

export default Button;