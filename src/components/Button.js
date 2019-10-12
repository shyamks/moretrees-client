import styled from 'styled-components'

const Button = styled.button`
    margin: 20px;
    font-size: 16px;
    font-weight: 500;
    color: ${(props) => (props.color ? props.color : 'white')};
    border-radius: 5px;
    border-width: 0px;
    background-color: ${(props) => props.disabled ? 'grey' : '#60bc0f'};
    height: ${(props) => (props.height ? props.height : '33px')};
    width: ${(props) => (props.width ? props.width : '100px')};
    outline: none;
    border: 1px solid #60bc0f;
    background-color: transparent;
    box-shadow:none;
    outline-style:none;

    &: hover{
        cursor: pointer;
    }
    &: active {
        outline: none;
        border: none;
    }
    &: focus {
        outline: none;

border-color:transparent;
    }
`

export default Button;