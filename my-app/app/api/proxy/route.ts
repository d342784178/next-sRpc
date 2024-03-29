// pages/api/[functionName].ts
import SuperJSON from "superjson";
import { NextRequest } from 'next/server';



// 修改POST函数以处理多个参数
export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const functionName = searchParams.get('functionName');
    // @ts-ignore
    const proxy = ProxyHub[functionName];

    if (proxy) {
        const args = await req.json();
        // 反序列化参数数组
        const argsArray: any[] = SuperJSON.deserialize(args);
        // ...argsArray 将参数数组展开为多个独立参数进行传递
        const functionResult = await proxy.invokeOrigin(...argsArray);
        //TODO 似乎是个bug必须重新构建一个对象
        return Response.json(SuperJSON.serialize(functionResult));
    } else {
        return Response.json(SuperJSON.serialize({ msg: '接口不存在:' + functionName }));
    }
}



type FetchFunctionType<TParams extends any[], TResult> = (...args: TParams) => Promise<TResult>;

// 修改Proxy类和withProxy函数以支持FetchFunctionType的新定义。
class Proxy<TParams extends any[], TResult> {
    private originFunc: FetchFunctionType<TParams, TResult>;
    private proxyFunc: FetchFunctionType<TParams, TResult>;

    constructor(originFunc: FetchFunctionType<TParams, TResult>) {
        this.originFunc = originFunc;
        this.proxyFunc = withProxy(originFunc);
    }

    protected invokeOrigin(...args: TParams): Promise<TResult> {
        return this.originFunc(...args);
    }

    public invoke(...args: TParams): Promise<TResult> {
        return this.proxyFunc(...args);
    }
}


// 修改withProxy函数定义以支持多个参数的fetchFunction
function withProxy<TParams extends any[], TResult>(
    fetchFunction: FetchFunctionType<TParams, TResult>
): (...args: TParams) => Promise<TResult> {
    const functionName = fetchFunction.name;
    const apiUrl = `/api/proxy?functionName=${functionName}`;

    return async (...args: TParams): Promise<TResult> => {
        
        if (typeof window === "undefined") {//服务端
            return fetchFunction(...args);
        } else {//客户端
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // 注意这里我们序列化的是参数数组
                body: SuperJSON.stringify(args),
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            return new Promise<TResult>((resolve, reject) => {
                response.json().then((json) => {
                    // 反序列化结果并处理多个参数
                    const result = SuperJSON.deserialize(json);
                    resolve(result as TResult);
                });
            });
        }
    };
}
// 确保ProxyHub中提供对应的支持多个参数的函数实现
export const ProxyHub = {
    // 用于演示，假设fetchGameHistory接受两个参数
    testFunction: new Proxy(testFunction),

    // ...根据需要添加其他函数
};

export async function testFunction(msg:string) {
    return msg;
  }