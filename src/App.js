import './App.css';
import CodeEditor from "./components/CodeEditor";
import Header from "./components/ui/Header";
import {types, useSnippet} from "./hooks/useSnippet";
import {useEffect} from "react";
import {useSearchParams} from "react-router-dom";

function App() {

    const [snippet, dispatchSnippet] = useSnippet();
    const [params, ] = useSearchParams();

    useEffect(() => {
        dispatchSnippet({
            type: types.updateMeta,
            code: params.get('code'),
            language_version: params.get('language_version') ?? '3.10',
            language: params.get('language') ?? 'python',
        });
        console.log();
    }, [dispatchSnippet, params]);

    const share = () => {
        let url = new URL(process.env.REACT_APP_ORIGIN_URL);
        url.searchParams.set('code', snippet.code ?? '');
        url.searchParams.set('language', snippet.language);
        url.searchParams.set('langauge_version', snippet.language_version);
        navigator.clipboard.writeText(url.toString()).then(() => {
            alert("Link copied");
        })
    }

    const updateSnippetMeta = (updates) => dispatchSnippet({
        type: types.updateMeta,
        ...updates,
    })
    const updateSnippetCode = (updates) => dispatchSnippet({
        type: types.updateCode,
        ...updates,
    })

    return (
        <>
            <Header showPopup={() => null}
                    updateSnippet={updateSnippetMeta}
                    snippet={snippet}
                    onShare={share}
            />
            <CodeEditor
                snippet={snippet}
                onChange={updateSnippetCode}
            />
        </>
    )
}

export default App;
