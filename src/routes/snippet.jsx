import {useParams} from "react-router-dom";
import useSnippet from "../hooks/useSnippet";
import CodeEditor from "../components/CodeEditor";
import Header from "../components/ui/Header";

export default function SnippetView() {

    const params = useParams();
    const [snippet] = useSnippet(params.username, params.snippet);
    if (snippet)
        return (
            <div style={{padding: 15, position: "relative", width: "100%", height: "calc(100% - 90px)"}}>
                <div style={{marginBottom: 20}}>
                    <Header/>
                </div>
                <CodeEditor
                    language={snippet.language}
                    version={snippet.version}
                    editable={true}
                    runnable={true}
                    sourceCode={snippet.code}
                />
            </div>
        )
    else
        return (
            <h1>loading...</h1>
        )
}