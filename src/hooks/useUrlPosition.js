
import {useSearchParams} from 'react-router-dom'

export default function useUrlPosition(...arg) {

    const [searchParams] = useSearchParams()

    let queryParams = {}
    arg.forEach(el => {
        queryParams[el] =  searchParams.get(el)
    });

    return {...queryParams}
}

