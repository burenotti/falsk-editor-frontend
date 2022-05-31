import {useParams} from "react-router-dom";
import useSnippet from "../hooks/useSnippet";
import CodeEditor from "../components/CodeEditor";

export default function SnippetView() {

    const params = useParams();
    const snippet = useSnippet(params.username, params.snippet);
    if (snippet)
        return (
            <CodeEditor
                language={snippet.language}
                version={snippet.version}
                editable={true}
                runnable={true}
                sourceCode={snippet.code}
            />
        )
    else
        return (
            <h1>loading...</h1>
        )
}