import styled from 'styled-components'
import React from 'react'
import { useState, useContext, useEffect } from 'react'
import Modal from 'react-modal'
import gql from 'graphql-tag'
import axios from 'axios'

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'
import { GET_ALL_USER_DONATIONS, ADD_NEW_PHOTO_MUTATION, IMGUR_KEY } from '../../constants';

import BootstrapTable from 'react-bootstrap-table-next'
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';

import useQueryApi from '../hooks/useQueryApi'
import useMutationApi from '../hooks/useMutationApi';
import Input from '../Input';
import { showToast, convertNullToEmptyString } from '../../utils';
import UserContext from '../UserContext';
import Logger from '../Logger';
import Button from '../Button'


// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType, FilePondPluginFileValidateSize)

const columns = [
    { dataField: 'treeId', text: 'TreeId', editable: false },
    { dataField: 'email', text: 'Email', sort: true, editable: false },
    { dataField: 'instaProfile', text: 'Insta', sort: true, editable: false },
    { dataField: 'twitterProfile', text: 'Twitter', sort: true, editable: false },
    { dataField: 'status', text: 'Status' },

]

const customStyles = () => {
    let customPadding = '0px'
    let style = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '30px',
            padding: customPadding,
            border: '0px',
            boxShadow: '3px 3px 5px 6px #ccc'
        }
    }
    return style

}

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
`

const rowStyle = { wordBreak: 'break-word' }

const cellEdit = {
    mode: 'click',
    blurToSave: true,
}

const ExpandButton = styled.div`
    &: hover {
        cursor: pointer;
    }
`

const getExpandRowObject = (updatePhotoApi, email, twitterId, instaId) => {
    const expandRow = {
        renderer: row => (
            <>
                <GetPhotoTimeline updatePhotoApi={updatePhotoApi} email={email} twitterId={twitterId} instaId={instaId} row={row} />
            </>
        ),
        onlyOneExpanding: true,
        expandHeaderColumnRenderer: ({ isAnyExpands }) => {
            if (isAnyExpands) {
                return <ExpandButton>-</ExpandButton>;
            }
            return <ExpandButton>+</ExpandButton>;
        },
        expandColumnRenderer: ({ expanded }) => {
            if (expanded) {
                return <ExpandButton>-</ExpandButton>;
            }
            return <ExpandButton>+</ExpandButton>;
        }
    }

    return expandRow

};

const PhotoTimelineItem = styled.div`
    display:flex;
    flex-direction: row;
`

const PhotoTimelineText = styled.p`
    width: 300px
`

const ExpansionContainer = styled.div`
    display: flex;
`

const ExistingPhotos = styled.div`
    display: flex;
    flex-direction: column;
`

const ChangePhotoContainer = styled.div`
    display: flex;
    flex-direction: column;
`


const FilePondContainer = styled.div`
    margin: 0 0 0 15px;
    width: 300px
`

const getLinkFromResponse = (response) => {
    if (response.data.success) {
        return response.data.data.link
    }
    console.error(response, 'response from imgur')
    throw Error('no link in the response')
}
function GetPhotoTimeline({ row, updatePhotoApi, email, instaId, twitterId }) {

    const initialTimeline = { file: [], text: '', changePhotoOrder: null, isNewPhoto: false }
    const [timeline, setTimeline] = useState(initialTimeline)
    const [modalStatus, setModalStatus] = useState({ open: false, photoUrl: null})
    let photoTimeline = row.photoTimeline
    const onChangeRow = (order) => {
        setTimeline({ ...timeline, isNewPhoto: false, changePhotoOrder: order })
    }
    const onPreviewRow = (photoUrl) => {
        setModalStatus({ open: true, photoUrl})
    }
    const onAddRow = () => {
        setTimeline({ ...timeline, isNewPhoto: true, changePhotoOrder: null })
    }
    const addNewItem = (apiInput, file) => {
        var formData = new FormData()
        formData.append('type', 'file')
        formData.append('mimetype', file.mimetype)
        formData.append('image', file)

        setTimeline(initialTimeline)
        axios({
            url: 'https://api.imgur.com/3/image',
            method: 'POST',
            headers: {
                Authorization: 'Client-ID ' + IMGUR_KEY,// imgur specific
            },
            data: formData
        }).then(response => {
            let link = getLinkFromResponse(response)
            apiInput = { ...apiInput, input: { ...apiInput.input, link } }
            updatePhotoApi(apiInput)
            console.log(response, 'return val')
        }).catch(err => {
            console.error(err, 'error occured in axios')
        })
    }

    let renderRow = photoTimeline.map(item => {
        let { order, text, photoUrl } = item

        let row = (
            <PhotoTimelineItem key={order}>
                <PhotoTimelineText>{text}</PhotoTimelineText>
                <Button onClick={() => onPreviewRow(photoUrl)}>Preview</Button>
                <Button onClick={() => onChangeRow(order)}>Change</Button>
            </PhotoTimelineItem>
        )
        return row
    })

    let { isNewPhoto, changePhotoOrder, file, text } = timeline
    let apiInput = { email, instaId, twitterId, input: { isNewPhoto, text, treeId: row.treeId, order: changePhotoOrder } }
    let realFile = file.length ? file[0].file : null
    return (
        <ExpansionContainer>
            <ExistingPhotos>
                {renderRow}
                <Button onClick={() => onAddRow()}>Add</Button>
            </ExistingPhotos>
            
            {(isNewPhoto || changePhotoOrder) &&
                <ChangePhotoContainer>
                    {isNewPhoto && <div>Add new item to timeline</div>}
                    {changePhotoOrder && <div>Change timeline {changePhotoOrder}</div>}
                    <Input numberInputWidth={'300px'} value={text}
                        onChange={(e) => setTimeline({ ...timeline, text: e.target.value })} placeholder={'Text for the photo'} />
                    <FilePondContainer>
                        <FilePond
                            acceptedFileTypes={['image/*']}
                            files={file}
                            maxFileSize={'9MB'}
                            labelFileTypeNotAllowed={'File of invalid type'}
                            allowMultiple={false}
                            onupdatefiles={(e) => {
                                console.log(e, 'updateFile')
                                setTimeline({ ...timeline, file: e })
                            }}
                            labelIdle='Drag n Drop your files or <span class="filepond--label-action">Browse</span>'
                        />
                    </FilePondContainer>
                    <Button disabled={!((file.length > 0) && (text.length > 0))} onClick={() => addNewItem(apiInput, realFile)}>Submit</Button>
                </ChangePhotoContainer>}
            <Modal isOpen={modalStatus.open}
                onAfterOpen={() => { }}
                onRequestClose={() => {
                    setModalStatus({ open: false, photoUrl: null })
                }}
                style={customStyles()}
                contentLabel={'image'}
            >
                {<img src={modalStatus.photoUrl} />}
            </Modal>
        </ExpansionContainer>
    )
}

const getDonationDate = (createdAt) => {
    let date = new Date(parseInt(createdAt))
    Logger(date, createdAt, 'date')
    return (date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear())
}

export function UsersDonatedTable() {
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext)
    let { email, twitterId, instaId } = contextUser || {}

    const [allUserDonationsData, isGetAllUserDonationsLoading, isGetAllUserDonationsError, refetchAllUserDonationsData] = useQueryApi(gql(GET_ALL_USER_DONATIONS), { email, twitterId, instaId })
    useEffect(() => {
        if (allUserDonationsData && allUserDonationsData.getAllUserDonations && !isGetAllUserDonationsError) {
            reset(allUserDonationsData.getAllUserDonations, true)
        }
    }, [allUserDonationsData, isGetAllUserDonationsError])

    const [updatedUserDonationData, updatedUserDonationLoading, updatedUserDonationError, setNewPhotoVariables, setUpdateUserDonationData] = useMutationApi(gql(ADD_NEW_PHOTO_MUTATION))
    useEffect(() => {
        if (updatedUserDonationData && updatedUserDonationData.data.addPhotoToTimeline && !updatedUserDonationError) {
            reset(updatedUserDonationData.data.addPhotoToTimeline, false)
        }
    }, [updatedUserDonationData, updatedUserDonationError])

    useEffect(() => {
        refetchAllUserDonationsData()
    }, [])

    const [tableState, setTableState] = useState([])

    console.log(allUserDonationsData, 'data')
    console.log(updatedUserDonationData, 'updatedUserDonationData')

    const reset = (data, isAllDonations) => {
        let allUsersDonated
        if (isAllDonations){
            allUsersDonated = data 
        }
        else {
            allUsersDonated = tableState
            allUsersDonated = allUsersDonated.map((userDonated) => {
                return (data.treeId == userDonated.treeId) ? data : userDonated
            })
            console.log(allUsersDonated,'allUsersDonatednew')
        }
        // let allUsersDonated = allUserDonationsData && allUserDonationsData.getAllUserDonations
        // console.log(allUsersDonated, 'allUsersDonated')
        
        allUsersDonated && setTableState(allUsersDonated)
    }

    let expandRow = getExpandRowObject(setNewPhotoVariables, email, twitterId, instaId)
    return (
        <>
            <BootstrapTable
                remote={{ cellEdit: true }}
                keyField='treeId'
                data={tableState}
                columns={columns}
                rowStyle={rowStyle}
                expandRow={expandRow}
                cellEdit={cellEditFactory(cellEdit)}
                pagination={paginationFactory()} />
            
        </>
    )
}