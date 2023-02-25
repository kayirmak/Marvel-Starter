import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }
        
    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (idx) => {
        itemRefs.current.forEach(ref => ref.classList.remove('char__item_selected'));
        itemRefs.current[idx].classList.add('char__item_selected');
        itemRefs.current[idx].focus();
    }
    
    function renderItems(arr) {
        const items =  arr.map((item, idx) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <CSSTransition
                    timeout={500}
                    classNames="char__item"
                >
                    <li 
                        key={item.id}
                        className="char__item"
                        tabIndex={0}
                        ref={el => itemRefs.current[idx] = el}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(idx);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                                props.onCharSelected(item.id);
                                focusOnItem(idx);
                            }
                        }}
                    >
                            <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                            <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        });

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }
    

    const items = renderItems(charList);
    
    const spinner = loading && !newItemLoading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;

    return (
        <div className="char__list">
            {spinner}
            {errorMessage}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}
                style={{display: charEnded ? 'none' : 'block'}}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;