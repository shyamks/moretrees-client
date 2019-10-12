import React, { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import Logger from '../Logger';

const useDataApi = ({ initialUrl, method, query }, auto = false, initialData) => {
    if (auto && !(initialUrl && method && query))
        throw Error("Auto is true but all arguments not present")
    const [data, setData] = useState(initialData);
    const [url, setUrl] = useState({ url: initialUrl, method, data: { query } });
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsError(false);
            setIsLoading(true);

            try {
                const result = await axios({ url: url.url || initialUrl, method: url.method || method, data: { query: url.query || query } });
                Logger(result, 'result')
                setData(result.data);
            } catch (error) {
                setIsError(true);
            }

            setIsLoading(false);
        };
        if (auto || url.url)
            fetchData();
    }, [url]);

    return [ data, isLoading, isError, setUrl, setData];
}

export default useDataApi