'use client';

import { useChat } from '@ai-sdk/react';
import { SendHorizonal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { generateQuery, runGeneratedSQLQuery } from '@/app/actions';
import { Message } from '@/lib/definitions';

export default function Chat ()
{
    const { messages, input, handleInputChange, handleSubmit } = useChat();
    // const [ messages, setMessages ] = useState<Message[]>( [] );
    // const [ input, setInput ] = useState( '' );
    const messagesEndRef = useRef<HTMLDivElement | null>( null );

    useEffect( () =>
    {
        messagesEndRef.current?.scrollIntoView( { behavior: 'smooth' } )
    }, [ messages ] );

    return (
        <div className="w-[500px] max-w-full flex flex-col border rounded-lg shadow h-[660px] bg-white dark:bg-zinc-900 px-4">
            <div className="flex-1 overflow-y-auto py-8 space-y-4">
                { messages.map( ( message ) => (
                    <div
                        key={ message.id }
                        className={ `flex ${ message.role === 'user' ? 'justify-end' : 'justify-start'
                            }` }
                    >
                        <div
                            className={ `max-w-xs md:max-w-sm p-3 rounded-lg shadow text-sm whitespace-pre-wrap ${ message.role === 'user'
                                ? 'bg-blue-100 text-blue-900'
                                : 'bg-gray-100 text-gray-800'
                                }` }
                        >
                            <div className="font-bold mb-1">
                                { message.role === 'user' ? 'User:' : 'AI:' }
                            </div>
                            {/* <div>{message.text}</div> */}
                            { message.parts.map( ( part, i ) =>
                            {
                                switch ( part.type )
                                {
                                    case 'text':
                                        return <div key={ `${ message.id }-${ i }` }>{ part.text }</div>;
                                    //   case 'tool-invocation':
                                    //     return (
                                    //         <pre key={`${message.id}-${i}`}>
                                    //             {JSON.stringify(part.toolInvocation, null, 2)}
                                    //         </pre>
                                    //     )
                                }
                            } ) }
                        </div>
                    </div>
                ) ) }
                <div ref={ messagesEndRef } />
            </div>

            <form
                onSubmit={ handleSubmit }
                className="w-full flex items-center py-4 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 sticky bottom-0"
            >
                <input
                    className="w-full pl-4 pr-10 py-3 border border-zinc-300 dark:border-zinc-700 rounded-full bg-white dark:bg-zinc-900 shadow focus:outline-none"
                    value={ input }
                    placeholder="Say something..."
                    onChange={handleInputChange}
                />
                <button
                    type="submit"
                    className="absolute right-7 text-zinc-500 hover:text-blue-500"
                >
                    <PaperPlaneIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    )
}