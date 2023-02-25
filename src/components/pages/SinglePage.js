import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import AppBanner from '../appBanner/AppBanner';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const SinglePage = ({Component, dataType}) => {
    const {dataId} = useParams();
    const [data, setData] = useState(null);

    const {loading, error, getCharacters, getComic, clearError} = useMarvelService();

    useEffect(() => {
        updateData();
    }, [dataId])
    
    const updateData = () => {
        clearError();

        switch (dataType) {
            case "comic":
                getComic(dataId)
                .then(onCharLoaded);
                break;
                
            case "character":
                getCharacters(dataId)
                .then(onCharLoaded);
                break;
            default:
                break;
        }
    }

    const onCharLoaded = (data) => {
        setData(data);
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !data) ? <Component data={data}/> : null;

    return (
        <>
            <AppBanner />
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}


export default SinglePage;