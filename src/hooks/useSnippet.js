import {useEffect, useReducer} from "react";
import BulbService from "../services/bulbService";
import useCurrentUser from "./useCurrentUser";


const types = Object.freeze({
    updateMeta: "updateMeta",
    updateCode: "updateCode",
    syncSuccess: "syncSuccess",
    syncFailed: "syncFailed",
    attachSuccess: "attachSuccess",
    attachFailed: "attachFailed",
    setIdentity: "setIdentity",
});

function useSnippet() {

    const [user,] = useCurrentUser();

    const initialState = {
        attachable: false,
        attached: false,
        lastSync: 0,
        lastUpdate: 0,
        error: null,
        snippet: {
            creator_username: null,
            name: null,
            code: "",
            language: null,
            language_version: null,
        },
    };
    const reducer = (state, {type, ...updates}) => {
        console.log('type', type === types.attachSuccess);
        let newState = state;
        if (type === types.updateMeta || type === types.updateCode) {
            newState = {
                ...state,
                lastUpdate: Date.now(),
                snippet: {...state.snippet, ...updates}
            };
        } else if (type === types.syncSuccess) {
            newState = {
                ...state,
                error: null,
                lastSync: updates.at,
            }
        } else if (type === types.syncFailed) {
            newState = {
                ...state,
                error: updates.error,
            }
        } else if (type === types.attachSuccess) {
            newState = {
                ...state,
                snippet: updates.snippet,
                attached: true,
            }
            console.log('state', state, newState);
        } else if (type === types.attachFailed) {
            newState = {
                ...state,
                attachable: false,
                error: updates.error,
            }
        } else if (type === types.setIdentity) {
            newState = {
                ...state,
                attachable: true,
                attached: false,
                snippet: {...state.snippet, ...updates},
            }
        }
        return newState;
    }
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        console.log(state);
        if (!user || !state || !state.attachable || state.attached) return;

        const service = new BulbService();
        service.getSnippet(
            state.snippet.creator_username,
            state.snippet.name,
            user.accessToken,
        ).then((snippet) => {
            dispatch({
                type: types.attachSuccess,
                snippet: snippet,
            });
        }).catch((error) => {
            dispatch({
                type: types.attachFailed,
                error: error,
            });
        });

    }, [user, state]);

    useEffect(() => {
        const isSynced = state.lastSync >= state.lastUpdate
        const service = new BulbService();
        const at = Date.now();
        console.log('synced', isSynced);
        if (isSynced || !state.attached || !user) return;


        service.patchSnippet(
            state.snippet.creator_username,
            state.snippet.name,
            state.snippet,
            user.accessToken,
        ).then(() => {
            dispatch({
                type: types.syncSuccess,
                at: at,
            })
        }).catch((error) => {
            dispatch({
                type: types.syncFailed,
                error: error,
            })
        })
    }, [user, state]);

    return [state.snippet, dispatch];
}

export {useSnippet, types};