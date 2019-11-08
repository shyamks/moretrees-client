import styled from 'styled-components'
import React from 'react'
import { useState, useContext, useEffect, useRef } from 'react'

import { adminOptions } from '../constants';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'

import { SelectDropdown } from './SelectDropdown'
import { AdminUsersTable } from './tables/AdminUsersTable';
import { AdminUsersDonatedTable } from './tables/AdminUsersDonatedTable';
import { AdminDonationsTable } from './tables/AdminDonationsTable';
import { isAdminUser } from '../utils';
import UserContext from './UserContext';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 15px 15px 70px 15px;
`

export default function AdminOptions({ }) {
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext)
    let isAdmin = isAdminUser(contextUser)

    const [selectedOption, setSelectedOption] = useState(adminOptions[0])

    const onAdminOptionChange = (option) => {
        if (selectedOption.value != option.value)
            setSelectedOption(option)
    }
    return (
        <Container>
            {isAdmin &&
                <SelectDropdown placeholder={'Select Table'} selectedOption={selectedOption}
                    options={adminOptions} onChange={onAdminOptionChange} />}
            {(adminOptions[0].value == selectedOption.value) && <AdminUsersTable />}
            {(adminOptions[1].value == selectedOption.value) && <AdminUsersDonatedTable />}
            {(adminOptions[2].value == selectedOption.value) && <AdminDonationsTable />}
        </Container>
    )
}