import './App.css';
import CodeEditor from "./components/CodeEditor";

function App() {

    const url = new URL(document.location.href);
    const editable = (url.searchParams.get('editable') ?? 'true') === 'true'
    const runnable = (url.searchParams.get('runnable') ?? 'true') === 'true'
    const code = url.searchParams.get('code')
    const language = url.searchParams.get('language')
    const languageVer = url.searchParams.get('lang_version')
    return (
        <div className="App">

            <CodeEditor
                sourceCode={code}
                editable={editable}
                runnable={runnable}
                language={language}
                version={languageVer}
            />

        </div>
    );
}

export default App;
