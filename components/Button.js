import styled from 'styled-components'

const Button = styled.button`
    margin: 20px;
    font-size: 16px;
    font-weight: 500;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    background-color: #fff;
    height: ${(props) => (props.height ? props.height : '33px')};
    width: ${(props) => (props.width ? props.width : '100px')};
    &: hover{
        cursor: pointer;
        background-color: green;
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