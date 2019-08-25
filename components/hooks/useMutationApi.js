import { useMutation } from '@apollo/react-hooks';
import { useState, useEffect } from 'react'

function useMutationApi(MUTATION) {
    const [savedApiData, setSavedApiData] = useState(null)
    const [variableDetails, setVariables] = useState(null)
    const [getData, { loading, error }] = useMutation(MUTATION)
    useEffect(() => {
        const callAPI = async () => {
            if (variableDetails) {
                const result = await getData({ variables: variableDetails })
                setSavedApiData(result)
                setVariables(null)
            }
        }
        callAPI()
    }, [variableDetails])

    // useEffect(() => {
    //     console.log('data effect',data)
    //     setSavedApiData(data)
    // }, [data])
    return [savedApiData, loading, error, setVariables, setSavedApiData]
}

export default useMutationApi