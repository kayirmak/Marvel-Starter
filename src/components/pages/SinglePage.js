import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import AppBanner from '../appBanner/AppBanner';
import setContent from '../../utils/setContent';

import useMarvelService from '../../services/MarvelService';

const SinglePage = ({Component, dataType}) => {
    const {dataId} = useParams();
    const [data, setData] = useState(null);

    const {getCharacters, getComic, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateData();
        // eslint-disable-next-line
    }, [dataId])
    
    const updateData = () => {
        clearError();

        switch (dataType) {
            case "comic":
                getComic(dataId)
                .then(onCharLoaded)
                .then(() => setProcess('confirmed'));
                break;
                
            case "character":
                getCharacters(dataId)
                .then(onCharLoaded)
                .then(() => setProcess('confirmed'));
                break;
            default:
                break;
        }
    }

    const onCharLoaded = (data) => {
        setData(data);
    }

    return (
        <>
            <AppBanner />
            {setContent(process, Component, data)}
        </>
    )
}


export default SinglePage;