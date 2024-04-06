'use client';
import { useState } from 'react';

import { trpc } from '../_trpc/client';
import { serverClient } from '../_trpc/serverClient';

export default function TodoList({
  initialTodos = [],
}: {
  initialTodos: Awaited<ReturnType<(typeof serverClient)['todo']['getTodos']>>;
}) {
  const getTodos = trpc.todo.getTodos.useQuery(undefined, {
    initialData: initialTodos,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const addTodo = trpc.todo.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });
  const setDone = trpc.todo.setDone.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });

  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  return (
    <div>
      <div className='flex gap-3 items-center'>
        <div className='flex-grow '>
          <input
            placeholder='Title'
            id='content'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className='border w-full mb-6 text-black bg-white rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2'
          />
          <textarea
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            value={description}
            placeholder='Description'
            id='content'
            className='border w-full text-black bg-white rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2'
          />
        </div>
        <button
          onClick={async () => {
            if (content.length) {
              addTodo.mutate({
                content,
                description,
              });
              setContent('');
            }
          }}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
        >
          Add Todo
        </button>
      </div>
      <div className='text-black my-5 text-3xl'>
        <h2 className='text-md mb-6'>List of Todos </h2>
        {getTodos?.data?.map((todo) => (
          <div key={todo.id} className='flex gap-3 items-center'>
            <input
              id={`check-${todo.id}`}
              type='checkbox'
              checked={!!todo.done}
              style={{ zoom: 1.5 }}
              onChange={async () => {
                setDone.mutate({
                  id: todo.id,
                  done: !todo.done,
                });
              }}
            />
            <div>
              <label htmlFor={`check-${todo.id}`} className='mb-2'>
                {todo.content}
              </label>
              <p className='text-xs'>{todo.description ?? '-'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
