import rootReducer from '../reducers';

import {applyMiddleware, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

const persistConfig = {
    key: 'root',
    storage
}

const enhancedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore() {
    const store = createStore (
        enhancedReducer
    );
    const persistor = persistStore(store);  // caching 'store' in localStorage
    return {store, persistor};
}