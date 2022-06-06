import './App.css';
import CodeEditor from "./components/CodeEditor";
import Header from "./components/ui/Header";
import {types, useSnippet} from "./hooks/useSnippet";

function App() {

    const url = new URL(document.location.href);
    const editable = (url.searchParams.get('editable') ?? 'true') === 'true'
    const runnable = (url.searchParams.get('runnable') ?? 'true') === 'true'
    const code = url.searchParams.get('code')
    const language = url.searchParams.get('language')
    const languageVer = url.searchParams.get('lang_version')

    const [snippet, dispatchSnippet] = useSnippet();
    const updateSnippetMeta = (updates) => dispatchSnippet({
        type: types.updateMeta,
        ...updates,
    })
    const updateSnippetCode = (updates) => dispatchSnippet({
        type: types.updateCode,
        ...updates,
    })
    return (

        <div className="App">
            <div style={{marginBottom: 20}}>
                <Header showPopup={() => null}
                        updateSnippet={updateSnippetMeta}
                        snippet={snippet}
                />
            </div>
            <CodeEditor
                sourceCode={code}
                editable={editable}
                runnable={runnable}
                language={language}
                version={languageVer}
                onChange={updateSnippetCode}
            />

        </div>
    );
}

export default App;
