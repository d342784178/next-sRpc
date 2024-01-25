# next-sRpc
针对nextJs(13)的一个简单的rpc实现,类似于tRpc. 但相比tRpc的使用更加简单. 

## 由来
作为nextJs菜鸟的本人在写某个练手项目的时候, 对于通过http调用后端的场景感觉有几点比较难受.
1. 类型丢失: 这里有两种情况的类型丢失
   - 类型提示丢失: 由于是通过http调用,因此ts无法进行类型提示.
   - 数据类型丢失: 由于http调用中数据经过了序列化,因此对于非基本类型数据,无论在server/client都不好处理,比方说Date类型. 
2. 接口定义麻烦: 在写页面过程中,经常会出现某个页面起初设计是服务端渲染,但是随着页面交互变复杂之后不得不改成客户端渲染的情况. 这种情况下就需要将原先服务端获取数据的函数包装成http接口暴露给客户端. 通常情况下需要增加这些动作: 接口定义/客户端参数序列化/服务端参数反序列化/函数调用/服务端返回值序列化/客户端返回值反序列化. 这么个过程至少20分钟.

本工具主要提供以下特性
1. 类型提示: 对于http接口提供类型提示
2. 类型安全: 解决序列化导致类型丢失的问题
3. 本地/http调用自适应: 只需要编写本地函数, 无需手动定义http接口, 自适应进行本地调用/http调用.


## 原理
编写一个函数代理,通过函数代理调用真实函数. 函数代理会判断当是客户端调用还是服务端调用,决定是直接调用函数还是通过http调用. 

如果是http调用,函数代理将会将请求发送到一个固定接口中,并把函数信息/参数传过去. 接口中解析函数信息/参数调用真实函数,并将结果返回. 

另外函数代理在http调用前后,会进行记录数据类型(借助superJson),防止http过程中数据类型丢失.


## 示例
[codeSandbox](https://codesandbox.io/p/github/d342784178/next-sRpc/main?embed=1&file=%2Fmy-app%2Fapp%2Fpage.tsx&showConsole=true&layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clrsxys7o00063j6hcrr3tewj%2522%252C%2522sizes%2522%253A%255B70%252C30%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clrsxys7o00023j6h42n1oqyd%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clrsxys7o00043j6h8dzn68kh%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clrsxys7o00053j6h72ovj2q2%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B60%252C40%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clrsxys7o00023j6h42n1oqyd%2522%253A%257B%2522id%2522%253A%2522clrsxys7o00023j6h42n1oqyd%2522%252C%2522tabs%2522%253A%255B%255D%257D%252C%2522clrsxys7o00053j6h72ovj2q2%2522%253A%257B%2522id%2522%253A%2522clrsxys7o00053j6h72ovj2q2%2522%252C%2522tabs%2522%253A%255B%257B%2522type%2522%253A%2522UNASSIGNED_PORT%2522%252C%2522port%2522%253A3000%252C%2522id%2522%253A%2522clrsyf98u01gj3j6hg1z4fqsw%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522path%2522%253A%2522%252F%2522%257D%255D%252C%2522activeTabId%2522%253A%2522clrsyf98u01gj3j6hg1z4fqsw%2522%257D%252C%2522clrsxys7o00043j6h8dzn68kh%2522%253A%257B%2522id%2522%253A%2522clrsxys7o00043j6h8dzn68kh%2522%252C%2522activeTabId%2522%253A%2522clrsybvcc01dy3j6h5fdj6bck%2522%252C%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clrsybvcc01dy3j6h5fdj6bck%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TERMINAL%2522%252C%2522shellId%2522%253A%2522clrsybv6g001re6g46xhf06tk%2522%257D%255D%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Atrue%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D)
[示例代码](https://github.com/d342784178/next-sRpc/tree/main/my-app)


## 使用
### 1. 依赖安装
安装superJson依赖包
```shell
npm i superjson
```
### 2. rpc实现拷贝

拷贝rpc实现到 app/api/proxy/route.ts
```typescript
// app/api/proxy/route.ts

import SuperJSON from "superjson";
import {NextRequest} from 'next/server';
import {loadPuzzle, putPuzzle} from "@/lib/service/PuzzleService";
import {listSudokuPuzzle} from "@/lib/dal/SudokuPuzzleMapper";
import {createUserStep, deleteUserStepById} from "@/lib/dal/UserStepMapper";

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
        if (typeof window === "undefined") {
            return fetchFunction(...args);
        } else {
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
        return Response.json(SuperJSON.serialize({...functionResult}));
    } else {
        return Response.json(SuperJSON.serialize({msg: '接口不存在:' + functionName}));
    }
}

// 确保ProxyHub中提供对应的支持多个参数的函数实现
export const ProxyHub = {
    //TODO 暴露函数
    loadPuzzle: new Proxy(loadPuzzle),
    // ...根据需要添加其他函数
};
```

### 3. 本地函数实现

```typescript

export async function loadPuzzle(id: string) {
    let gameJsonObject = await getSudokuPuzzleById(id);
    let userStepsJsonArray = await getUserStepByPuzzleId(id);
    if (gameJsonObject) {
        let game1 = GameHelper.parseGame(gameJsonObject)
        game1.userSteps = userStepsJsonArray ? userStepsJsonArray : [];
        return game1;
    } else {
        return undefined;
    }
}

```

### 4. 暴露函数

```typescript
// app/api/proxy/route.ts
export const ProxyHub = {
    //将你的函数通过ProxyHub暴露出去
    loadPuzzle: new Proxy(loadPuzzle),
    youFunction: new Proxy(youFunction),
};

```

### 5. 使用函数


```typescript
// app/xxx/page.ts
ProxyHub.loadPuzzle.invoke(params.id).then((result) => {
        //xxxxx
});

```
