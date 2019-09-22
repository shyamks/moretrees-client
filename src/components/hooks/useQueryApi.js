import { useQuery } from '@apollo/react-hooks';

function useQueryApi(QUERY, variableDetails) {
    // const [savedApiData, setSavedApiData] = useState(null)
    // const [variableDetails, setVariables] = useState(null)
    const { loading, data, error, refetch} = useQuery(QUERY, {variables: variableDetails})
    // useEffect(() => {
    //     const login = async () => {
    //         if (variableDetails) {
    //             getData({ variables: variableDetails })
    //             setVariables(null)
    //         }
    //     }
    //     login()
    // }, [variableDetails])

    // useEffect(() => {
    //     setSavedApiData(data)
    // }, [data])
    return [data, loading, error, refetch]
}

export default useQueryApi