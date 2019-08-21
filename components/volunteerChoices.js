import { useState } from 'react'
import styled from 'styled-components'

import Checkbox from './Checkbox'
import PriorityList from './PriorityList'
import Button from './Button';
import IndividualInfo from './IndividualInfo'

const volunteerOptions = [
    {
        name: 'check-box-1',
        key: 'plant1',
        label: 'Plant trees',
    },
    {
        name: 'check-box-2',
        key: 'plant2',
        label: 'Pick location to plant trees',
    },
    {
        name: 'check-box-3',
        key: 'plant3',
        label: 'Help locate the areas where more trees could be planted',
    },
    {
        name: 'check-box-4',
        key: 'plant4',
        label: 'Work with us in the organization in a broader capacity',
    },
];

const volunteerTimings = [
    {
        name: 'check-box-1',
        key: 'time1',
        label: 'Betweeen 4-5pm',
    },
    {
        name: 'check-box-2',
        key: 'time2',
        label: 'Betweeen 5-6pm',
    },
    {
        name: 'check-box-3',
        key: 'time3',
        label: 'Betweeen 6-7pm',
    },
    {
        name: 'check-box-4',
        key: 'time4',
        label: 'Betweeen 7-5pm',
    },
];


const ListContainer = styled.div`
    display: flex;
`

const OptionList = styled.div`
    padding: 20px;
`

const Option = styled.div`
    padding: 5px;
    display: flex;
`

const OptionLabel = styled.span`
    margin: 10px;
    display:inline-block;
    width: 400px;
    word-wrap: break-word;
`

function VolunteerChoices() {
    let [selectedOption, setOption] = useState({ checkedItems: new Map(), checkedPriority: [] })
    const handleChange = (e) => {
        const itemName = e.target.name
        const item = volunteerOptions.filter(checkbox => checkbox.name == itemName)[0]
        const isChecked = e.target.checked
        let prevCheckedPriority = selectedOption.checkedPriority
        if (isChecked) {
            prevCheckedPriority.push(item)
        }
        else {
            let index = prevCheckedPriority.indexOf(item)
            if (index > -1) {
                prevCheckedPriority.splice(index, 1);
            }
        }
        setOption(prevState => ({ checkedItems: prevState.checkedItems.set(itemName, isChecked), checkedPriority: prevCheckedPriority }))
        console.log(selectedOption, 'selectedOption')
    }
    return (
        <div>
            <div> There is nothing better than doing it.</div>
            <div> What would you like to do ?</div>
            <React.Fragment>
                <ListContainer>
                    <OptionList>
                        {
                            volunteerOptions.map(item => (
                                <Option key={item.key}>
                                    <OptionLabel>
                                        {item.label}
                                    </OptionLabel>
                                    <Checkbox
                                        name={item.name}
                                        checked={selectedOption.checkedItems.get(item.name)}
                                        onChange={handleChange}
                                    />
                                </Option>
                            ))
                        }
                    </OptionList>
                    <PriorityList items={selectedOption.checkedPriority}/>
                </ListContainer>
                <IndividualInfo/>
                <Button onClick={()=>{}}> Submit </Button>
            </React.Fragment>
        </div>
    )
}

export default VolunteerChoices