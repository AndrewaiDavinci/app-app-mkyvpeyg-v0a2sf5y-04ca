import React, { useState, useEffect, useCallback } from 'react';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Check from 'lucide-react/dist/esm/icons/check';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Heart from 'lucide-react/dist/esm/icons/heart';
import { cn } from './lib/utils';

export default function App() {
  // 상태 관리: 투두 리스트
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('ghibli-todos');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: '강아지 산책시키기 🐾', completed: false },
      { id: 2, text: '지브리 영화 정주행하기 🎬', completed: true },
    ];
  });

  const [inputValue, setInputValue] = useState('');

  // 로컬 스토리지 저장
  useEffect(() => {
    localStorage.setItem('ghibli-todos', JSON.stringify(todos));
  }, [todos]);

  // 투두 추가
  const addTodo = useCallback((e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    
    setTodos(prev => [newTodo, ...prev]);
    setInputValue('');
  }, [inputValue]);

  // 투두 토글
  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  // 투두 삭제
  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#F4E4BC] font-sans selection:bg-[#FF8C00] selection:text-white">
      {/* 배경 데코레이션 (지브리 느낌의 감성) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#FF8C00]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#5C4033]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-md rounded-[2rem] shadow-2xl border-4 border-[#5C4033]/10 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-700">
        
        {/* 헤더 섹션: 강아지 이미지와 타이틀 */}
        <div className="relative h-48 bg-[#5C4033] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800" 
            alt="Cute dogs"
            className="w-full h-full object-cover opacity-80 hover:scale-110 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#5C4033] to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-[#F4E4BC] flex items-center gap-2">
                포근한 할 일 <Heart className="w-6 h-6 fill-[#FF8C00] text-[#FF8C00]" />
              </h1>
              <p className="text-[#F4E4BC]/80 text-sm mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
              </p>
            </div>
            <div className="bg-[#FF8C00] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              완료 {completedCount}/{todos.length}
            </div>
          </div>
        </div>

        {/* 입력 섹션 */}
        <form onSubmit={addTodo} className="p-6 pb-2">
          <div className="relative group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="오늘의 할 일을 적어보세요..."
              className="w-full bg-[#F4E4BC]/30 border-2 border-transparent focus:border-[#FF8C00] focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all duration-300 text-[#5C4033] placeholder-[#5C4033]/40 pr-14"
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 bottom-2 aspect-square bg-[#FF8C00] text-white rounded-xl flex items-center justify-center hover:bg-[#5C4033] transition-colors duration-300 shadow-md active:scale-95"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </form>

        {/* 리스트 섹션 */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[400px] space-y-3 custom-scrollbar">
          {todos.length === 0 ? (
            <div className="text-center py-10 opacity-40">
              <p className="text-[#5C4033] font-medium">비어있어요. 새로운 일을 추가해볼까요?</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div 
                key={todo.id}
                className={cn(
                  "group flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 border-b border-[#F4E4BC]/50",
                  todo.completed ? "bg-stone-50/50" : "bg-white hover:shadow-md hover:-translate-y-0.5"
                )}
              >
                <button 
                  onClick={() => toggleTodo(todo.id)}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    todo.completed 
                      ? "bg-[#FF8C00] border-[#FF8C00] text-white" 
                      : "border-[#5C4033]/20 hover:border-[#FF8C00]"
                  )}
                >
                  {todo.completed && <Check className="w-4 h-4 stroke-[3px]" />}
                </button>
                
                <span className={cn(
                  "flex-1 text-[#5C4033] transition-all duration-300",
                  todo.completed && "line-through opacity-40"
                )}>
                  {todo.text}
                </span>

                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-stone-400 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* 푸터 데코레이션 */}
        <div className="p-4 text-center">
          <span className="text-[10px] text-[#5C4033]/30 tracking-widest uppercase">
            Ghibli Dog Todo • Stay Cozy
          </span>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #F4E4BC;
          border-radius: 10px;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}