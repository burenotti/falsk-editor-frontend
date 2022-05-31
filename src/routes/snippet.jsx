import {useParams} from "react-router-dom";
import useSnippet from "../hooks/useSnippet";
import CodeEditor from "../components/CodeEditor";
import Header from "../components/ui/Header";
import {useEffect} from "react";

export default function SnippetView({popup}) {
    const [showPopup, ] = popup;
    const params = useParams();
    const [snippet, updateSnippet] = useSnippet(params.username, params.snippet);

    useEffect(() => {
        document.title = snippet ? snippet.name : "Code Flask";
    }, [snippet])


    if (snippet)
        return (
            <div style={{padding: 15, position: "relative", width: "100%", height: "calc(100% - 90px)"}}>
                <div style={{marginBottom: 20}}>
                    <Header showPopup={showPopup} snippet={snippet} updateSnippet={updateSnippet}/>
                </div>
                <CodeEditor
                    snippet={snippet}
                    onChange={updateSnippet}
                    editable={true}
                    runnable={true}
                />
            </div>
        )
    else
        return (
            <h1>loading...</h1>
        )
}