'use client'

import { useEffect, useState } from "react";
import { ProxyHub } from "./api/proxy/route";


export default function Home() {
    const [result, setResult] = useState<string>()
    useEffect(() => {
        ProxyHub.testFunction.invoke('客户端渲染').then((result) => {
            setResult(result)
        });
    }, []);
    return (
        <main >
            <span>{result}</span>
        </main>
    );

}