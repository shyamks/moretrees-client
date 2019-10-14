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
    outline: 0;
    &: hover{
        cursor: pointer;
    }
    &: active {
        outline: 0;
        border: none;
    }
    &: focus {
        outline: 0;
        border: none;
    }
`

export default Button;