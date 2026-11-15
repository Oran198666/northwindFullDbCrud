import { useState } from "react";
import "./ask-mcp.css";
import { appConfig } from "../../../utils/app-config";
import axios from "axios";
import { notify } from "../../../utils/notify";

export function AskMcp() {
    const [Loading, setLoading] = useState<boolean>(false);
    const [question, setQuestion] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");

    async function send() {
        try {
            setLoading(true);
            setAnswer("");
            const response = await axios.post<{ answer: string }>(appConfig.askUrl, { question });
            setAnswer(response.data.answer);
        }
        catch (err: any) {
            notify.error(err);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="AskMcp">

            <h2>Ask about employees and orders</h2>
            <input type="text" value={question} onChange={e => setQuestion(e.target.value)}
                disabled={Loading} style={{ width: "400px" }} />
            <button onClick={send} disabled={Loading}>Send</button>
            {Loading && <p>Thinking...</p>}
            <pre style={{whiteSpace:"pre-wrap"}}>{answer}</pre>
        </div>
    );
}
