import styled from 'styled-components'
import React from 'react'
import { useState, useContext, useEffect, useRef } from 'react'

import { adminOptions } from '../constants';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'bootstrap/dist/css/bootstrap.css';

import { SelectDropdown } from './SelectDropdown'
import { UsersTable } from './tables/UsersTable';
import { UsersDonatedTable } from './tables/UsersDonatedTable';
import { DonationsTable } from './tables/DonationsTable';
import useClient from './hooks/useClient';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 15px 15px 70px 15px;
`

export default function AdminOptions({ }) {
    const [selectedOption, setSelectedOption] = useState(adminOptions[0])

    const onAdminOptionChange = (option) => {
        if (selectedOption.value != option.value)
            setSelectedOption(option)
    }

    return (
        <Container>
            <SelectDropdown placeholder={'Select Table'} selectedOption={selectedOption}
                options={adminOptions} onChange={onAdminOptionChange} />
            {(adminOptions[0].value == selectedOption.value) && <UsersTable />}
            {(adminOptions[1].value == selectedOption.value) && <UsersDonatedTable />}
            {(adminOptions[2].value == selectedOption.value) && <DonationsTable />}
        </Container>
    )
}