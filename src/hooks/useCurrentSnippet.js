import {useParams} from "react-router-dom";
import {useSnippet} from "./useSnippet";

export default function useCurrentSnippet() {
    const params = useParams();
    const [snippet, updateSnippet] = useSnippet(params.username, params.snippet);
    return [snippet, updateSnippet]
}