
import React, { useState, useMemo, useEffect } from 'react';
import { ScreenType, GameState, GameDefinition } from './types';
import { ROADMAP, PRAISE_MESSAGES } from './constants';
import { soundService } from './services/SoundService';
import { Celebration } from './components/Celebration';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    selectedGameId: null,
    currentLevelIndex: 0,
    score: 0,
    isSoundEnabled: true,
    screen: 'LOBBY',
  });

  const [lastPraise, setLastPraise] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const currentGame = useMemo(() => 
    ROADMAP.find(g => g.id === state.selectedGameId) || null
  , [state.selectedGameId]);

  const isEnglishGame = currentGame?.category === 'English';
  const gameLang = isEnglishGame ? 'en-US' : 'vi-VN';

  // Đọc hướng dẫn khi vào màn chơi mới
  useEffect(() => {
    if (state.screen === 'PLAYING' && currentGame) {
      const level = currentGame.levels[state.currentLevelIndex];
      // Delay một chút để bé định hình
      setTimeout(() => {
        soundService.speak(level.instruction, gameLang);
      }, 500);
    }
  }, [state.screen, state.currentLevelIndex, currentGame, gameLang]);

  const wakeUpSound = () => {
    if (!hasInteracted) setHasInteracted(true);
    soundService.resume();
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    wakeUpSound();
    const newVal = !state.isSoundEnabled;
    soundService.setEnabled(newVal);
    setState(prev => ({ ...prev, isSoundEnabled: newVal }));
  };

  const progress = useMemo(() => {
    if (!currentGame) return 0;
    return ((state.currentLevelIndex) / currentGame.levels.length) * 100;
  }, [state.currentLevelIndex, currentGame]);

  const selectGame = (gameId: string) => {
    wakeUpSound();
    soundService.playClick();
    setState(prev => ({ ...prev, selectedGameId: gameId, screen: 'START', currentLevelIndex: 0, score: 0 }));
    
    // Đọc tên game khi chọn
    const game = ROADMAP.find(g => g.id === gameId);
    if (game) soundService.speak(game.title.split('–')[0], 'vi-VN');
  };

  const startGame = () => {
    wakeUpSound();
    soundService.playClick();
    setState(prev => ({ ...prev, screen: 'PLAYING' }));
  };

  const handleOptionClick = (opt: any) => {
    wakeUpSound();
    // Đọc tên vật thể bé vừa chọn
    soundService.speak(opt.label, gameLang);

    if (opt.isCorrect) {
      const randomPraise = PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)];
      setLastPraise(randomPraise);
      // Phát âm thanh thắng cuộc và đọc lời khen
      soundService.playSuccess(randomPraise, false);
      setState(prev => ({ ...prev, screen: 'CELEBRATION', score: prev.score + 1 }));
    } else {
      soundService.playIncorrect();
    }
  };

  const handleCelebrationEnd = () => {
    if (currentGame && state.currentLevelIndex + 1 < currentGame.levels.length) {
      soundService.playLevelComplete();
      setState(prev => ({
        ...prev,
        currentLevelIndex: prev.currentLevelIndex + 1,
        screen: 'PLAYING'
      }));
    } else {
      soundService.playFinish();
      setState(prev => ({ ...prev, screen: 'FINISH' }));
    }
  };

  const goBackToLobby = () => {
    wakeUpSound();
    soundService.playClick();
    setState(prev => ({ ...prev, screen: 'LOBBY', selectedGameId: null }));
  };

  const renderLobby = () => {
    const categories = [
      { id: 'English', label: '🇬🇧 English', color: 'bg-blue-500' },
      { id: 'Math', label: '🔢 Toán Học', color: 'bg-green-500' },
      { id: 'Vietnamese', label: '🇻🇳 Tiếng Việt', color: 'bg-red-500' },
      { id: 'Logic', label: '🧠 Tư Duy/IQ', color: 'bg-purple-500' },
    ];

    const filteredGames = filter ? ROADMAP.filter(g => g.category === filter) : ROADMAP;

    return (
      <div className="h-full overflow-y-auto bg-[#f8fafc] p-4 pb-24 scroll-smooth">
        {!hasInteracted && (
          <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center">
             <div className="text-8xl mb-6 animate-bounce">🧸</div>
             <h2 className="text-3xl font-black mb-4">Chào mừng bé đến với Học Viện Siêu Nhí!</h2>
             <button 
                onClick={wakeUpSound}
                className="bg-green-500 hover:bg-green-400 text-white px-10 py-4 rounded-full text-2xl font-black shadow-2xl active:scale-95 transition-all"
             >
               NHẤN ĐỂ BẮT ĐẦU HỌC 🔊
             </button>
          </div>
        )}

        <header className="relative text-center mb-8 mt-4">
          <div className="absolute right-0 top-0">
             <button 
              onClick={toggleSound}
              className="p-3 bg-white rounded-full shadow-sm border border-slate-100 text-2xl active:scale-90 transition-transform"
              title={state.isSoundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
            >
              {state.isSoundEnabled ? "🔊" : "🔈"}
            </button>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 mb-2 drop-shadow-sm">Học Viện Siêu Nhí 🧸</h1>
          <p className="text-slate-500 font-medium">100+ Game: Nghe - Học - Chơi cùng bé</p>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-8 sticky top-0 z-10 bg-[#f8fafc]/90 backdrop-blur py-3">
          <button 
            onClick={() => { wakeUpSound(); soundService.playClick(); setFilter(null); }}
            className={`px-5 py-2 rounded-full font-bold text-sm shadow-sm transition-all ${!filter ? 'bg-slate-800 text-white scale-105' : 'bg-white text-slate-600 border border-slate-100'}`}
          >
            Tất cả ({ROADMAP.length})
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => { wakeUpSound(); soundService.playClick(); setFilter(cat.id); }}
              className={`px-5 py-2 rounded-full font-bold text-sm shadow-sm transition-all ${filter === cat.id ? `${cat.color} text-white scale-105` : 'bg-white text-slate-600 border border-slate-100'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredGames.map((game) => (
            <button
              key={game.id}
              onClick={() => selectGame(game.id)}
              className="bg-white p-4 rounded-3xl shadow-sm hover:shadow-md border-2 border-transparent hover:border-slate-200 transition-all flex flex-col items-center text-center group active:scale-95"
            >
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {game.icon}
              </div>
              <h3 className="text-[11px] font-black text-slate-700 leading-tight mb-2 h-10 flex items-center justify-center">
                {game.title.split('–')[0]}
              </h3>
              <div className="mt-auto">
                <span className="text-[8px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black uppercase">
                  {game.ageRange}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderGameScreen = () => {
    if (!currentGame) return renderLobby();

    switch (state.screen) {
      case 'START':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gradient-to-b from-white to-slate-50">
            <div className="bounce-slow text-9xl mb-6">{currentGame.icon}</div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 px-4 leading-tight" style={{ color: currentGame.themeColor }}>
              {currentGame.title}
            </h1>
            <div className="bg-white px-6 py-2 rounded-full shadow-sm text-slate-500 font-bold mb-10 border border-slate-100">
              Độ tuổi phù hợp: {currentGame.ageRange}
            </div>
            <div className="flex flex-col space-y-4 w-full max-w-xs">
              <button
                onClick={startGame}
                className="text-white text-2xl px-12 py-5 rounded-full shadow-xl font-bold transform transition active:scale-90 border-b-8 hover:brightness-110"
                style={{ backgroundColor: currentGame.themeColor, borderColor: 'rgba(0,0,0,0.15)' }}
              >
                VÀO CHƠI THÔI! ▶️
              </button>
              <button onClick={goBackToLobby} className="text-slate-400 font-bold hover:text-slate-600">
                Quay lại Menu
              </button>
            </div>
          </div>
        );

      case 'PLAYING':
      case 'CELEBRATION':
        const level = currentGame.levels[state.currentLevelIndex];
        return (
          <div className="flex flex-col h-full bg-white" onClick={wakeUpSound}>
            <div className="pt-4 px-4 pb-2">
              <div className="flex justify-between items-center mb-2">
                <button onClick={goBackToLobby} className="text-3xl filter grayscale hover:grayscale-0 active:scale-90">🏠</button>
                <div className="flex-grow mx-4">
                  <div className="w-full bg-slate-100 h-6 rounded-full p-1 shadow-inner overflow-hidden border border-slate-50">
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out progress-glow"
                      style={{ 
                        width: `${progress}%`, 
                        backgroundColor: currentGame.themeColor,
                      }}
                    >
                      <div className="h-full w-full bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[stripes_1s_linear_infinite]"></div>
                    </div>
                  </div>
                </div>
                <div className="text-xl font-black text-slate-400 italic">
                  {state.currentLevelIndex + 1}/{currentGame.levels.length}
                </div>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                  {currentGame.title}
                </span>
              </div>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center p-6 space-y-12">
              <div className="bubble-pop">
                <h2 className="text-3xl md:text-5xl font-black text-center text-slate-800 leading-tight">
                  {level.instruction}
                  <button 
                    onClick={(e) => { e.stopPropagation(); soundService.speak(level.instruction, gameLang); }}
                    className="ml-4 text-2xl align-middle bg-slate-100 p-2 rounded-full hover:bg-slate-200 active:scale-90"
                  >
                    🔊
                  </button>
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                {level.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionClick(opt)}
                    className="aspect-square flex flex-col items-center justify-center p-6 bg-white rounded-[3rem] shadow-xl border-4 border-slate-50 hover:border-slate-200 transition-all transform active:scale-90 group"
                  >
                    <span className="text-7xl md:text-8xl mb-4 group-hover:scale-110 transition-transform duration-300">{opt.icon}</span>
                    <span className="text-lg md:text-xl font-bold text-slate-600">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {state.screen === 'CELEBRATION' && (
              <Celebration onComplete={handleCelebrationEnd} message={lastPraise} />
            )}
          </div>
        );

      case 'FINISH':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gradient-to-b from-yellow-50 to-white">
            <div className="text-9xl mb-6 animate-bounce">🏆</div>
            <div className="space-y-4 mb-12">
              <h2 className="text-5xl font-black text-yellow-500">HOÀN THÀNH XUẤT SẮC!</h2>
              <p className="text-2xl text-slate-600 font-medium italic">Bé đã vượt qua bài học:<br/><span className="font-black text-slate-800">{currentGame.title.split('–')[0]}</span></p>
            </div>
            <div className="flex flex-col space-y-4 w-full max-w-xs">
              <button
                onClick={goBackToLobby}
                className="bg-slate-800 text-white text-2xl px-12 py-5 rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                BÀI HỌC TIẾP THEO ➡️
              </button>
              <button
                onClick={() => { wakeUpSound(); soundService.playClick(); setState(prev => ({ ...prev, screen: 'START', currentLevelIndex: 0 })); }}
                className="text-slate-400 font-bold hover:text-slate-600"
              >
                Chơi lại bài này 🔄
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 select-none touch-none overflow-hidden bg-white" onClick={wakeUpSound}>
      {state.screen === 'LOBBY' ? renderLobby() : renderGameScreen()}
    </div>
  );
};

export default App;
