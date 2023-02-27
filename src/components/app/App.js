import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spinner/Spinner";

const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicPage = lazy(() => import('../pages/singleComicLayout/singleComicLayout'));
const SingleCharPage = lazy(() => import('../pages/singleCharacterLayout/SingleCharacterLayout'));
const SinglePage = lazy(() => import('../pages/SinglePage'));

const App = () => {
    const baseUrl = '/Marvel-Starter';
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner />}>
                        <Routes>
                            <Route path={`${baseUrl}/`} element={<MainPage />} />
                            <Route path={`${baseUrl}/comics`} element={<ComicsPage />} />
                            <Route
                                path={`${baseUrl}/comics/:dataId`}
                                element={<SinglePage 
                                    Component={SingleComicPage}
                                    dataType="comic" 
                                />} 
                            />
                            <Route
                                path={`${baseUrl}/characters/:dataId`}
                                element={<SinglePage
                                    Component={SingleCharPage}
                                    dataType="character" 
                                />}
                            />
                            <Route path={`${baseUrl}/*`} element={<Page404 />} />
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

export default App;