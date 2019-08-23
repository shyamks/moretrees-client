import React from 'react';
import styled from 'styled-components'

const CheckboxInput = styled.input`

`
function Checkbox({ type = 'checkbox', name, checked = false, onChange }){
    return (
        <CheckboxInput type={type} name={name} checked={checked} onChange={(e)=>{e.persist();onChange(e)}} />
    );
}

// Checkbox.propTypes = {
//   type: React.PropTypes,
//   name: React.PropTypes.string.isRequired,
//   checked: React.PropTypes.bool,
//   onChange: React.PropTypes.func.isRequired,
// }

export default Checkbox;