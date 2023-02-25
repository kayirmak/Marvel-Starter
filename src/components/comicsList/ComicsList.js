import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();
    useEffect(() => {
        onRequest(offset, true);
    }, [])
    
    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded);
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList([...comicsList, ...newComicsList]);
        setOffset(offset => offset + 8);
        setNewItemLoading(false);
        setComicsEnded(ended);
    }

    function renderItems(comicsList) {
        const items = comicsList.map((comics, idx) => {
            return (
                <li 
                    tabIndex={0}
                    key={idx}
                    className="comics__item">
                    <Link to={`/comics/${comics.id}`}>
                        <img src={comics.thumbnail} alt={comics.title} className="comics__item-img"/>
                        <div className="comics__item-name">{comics.title}</div>
                        <div className="comics__item-price">{comics.price}</div>
                    </Link>
                </li>
            )
        });
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(comicsList);

    const spinner = loading && !newItemLoading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null 

    return (
        <div className="comics__list">
            {spinner}
            {errorMessage}
            {items}
            <button 
                onClick={() => onRequest(offset)}
                disabled={newItemLoading}
                style={{display: comicsEnded ? 'none' : 'block'}}
                className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;