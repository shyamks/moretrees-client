import React, { useState, useRef, useEffect, useContext } from 'react'
import Select from 'react-select';

const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'green',
      padding: 20,
    }),
    control: (provided, state) => ({
      // none of react-select's styles are passed to <Control />
      ...provided,
      width: 300,
      display: 'flex'
    }),
    container: (provided, state) => {
        return {...provided, width: 300, display: 'flex'}
    },
    singleValue: (provided, state) => {

      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }
  }

export function SelectDropdown({ placeholder, options, onChange, selectedOption }) {
    
    const [dropdownOption, setDropdownOptions] = useState({ selectedOption })
    const handleChange = selectedOption => {
        setDropdownOptions(
            { selectedOption }
        )
        onChange && onChange(selectedOption)
    }
    // let { selectedOption } = dropdownOption || {}
    return (
        <Select
            placeholder={placeholder}
            styles={customStyles}
            value={selectedOption}
            onChange={handleChange}
            options={options}
        />
    )
}