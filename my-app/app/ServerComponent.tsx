import { ProxyHub } from "./api/proxy/route";


export default async function Home() {
    const result = await ProxyHub.testFunction.invoke('服务端渲染')

    return (
        <main >
            <span>{result}</span>
        </main>
    );

}