import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { useState, useEffect } from 'react'

function useLazyQueryApi(QUERY) {
    const [savedApiData, setSavedApiData] = useState(null)
    const [variableDetails, setVariables] = useState(null)
    const [getData, { loading, data, error }] = useLazyQuery(QUERY, { fetchPolicy: 'network-only' })
    useEffect(() => {
        const login = async () => {
            if (variableDetails) {
                getData({ variables: variableDetails })
                setVariables(null)
            }
        }
        login()
    }, [variableDetails])

    useEffect(() => {
        setSavedApiData(data)
    }, [data])
    return [savedApiData, loading, error, setVariables, setSavedApiData]
}

export default useLazyQueryApi