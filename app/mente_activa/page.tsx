'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- Definición de Tipos ---
interface CardMemoria {
  id: number;
  emoji: string;
  matched: boolean;
  flipped: boolean;
}
// --- Fin Definición de Tipos ---

export default function MenteActivaPage() {
  const [juegoActivo, setJuegoActivo] = useState('menu');
  
  // Estado para Memoria de Parejas
  const [cardsMemoria, setCardsMemoria] = useState<CardMemoria[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [movesMemoria, setMovesMemoria] = useState(0);
  const [matchesMemoria, setMatchesMemoria] = useState(0);
  const [timeMemoria, setTimeMemoria] = useState(0);
  const [gameStartedMemoria, setGameStartedMemoria] = useState(false);
  const [gameWonMemoria, setGameWonMemoria] = useState(false);
  const [scoreMemoria, setScoreMemoria] = useState(0);

  // Estado para Secuencia
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [displaySequence, setDisplaySequence] = useState(false);
  const [levelSecuencia, setLevelSecuencia] = useState(1);
  const [scoreSecuencia, setScoreSecuencia] = useState(0);
  const [bestScoreSecuencia, setBestScoreSecuencia] = useState(0);
  const [gameOverSecuencia, setGameOverSecuencia] = useState(false);
  const [gameStartedSecuencia, setGameStartedSecuencia] = useState(false);
  const [highlightedNum, setHighlightedNum] = useState<number | null>(null);

  const emojis = ['🍎', '🍌', '🍊', '🍇', '🍓', '🍒', '🥝', '🍑'];

  // Timer para Memoria
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStartedMemoria && !gameWonMemoria && juegoActivo === 'memoria') {
      interval = setInterval(() => {
        setTimeMemoria(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStartedMemoria, gameWonMemoria, juegoActivo]);

  // Verificar victoria Memoria
  useEffect(() => {
    if (matchesMemoria === 8 && gameStartedMemoria) {
      setGameWonMemoria(true);
      const baseScore = 1000;
      const timePenalty = Math.max(0, timeMemoria * 2);
      const movePenalty = Math.max(0, (movesMemoria - 16) * 10);
      const finalScore = Math.max(100, baseScore - timePenalty - movePenalty);
      setScoreMemoria(Math.round(finalScore));
    }
  }, [matchesMemoria, gameStartedMemoria, timeMemoria, movesMemoria]);

  // Funciones Memoria de Parejas
  const initializeMemoria = () => {
    const shuffledEmojis = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        matched: false,
        flipped: false
      }));
    
    setCardsMemoria(shuffledEmojis);
    setFlippedIndices([]);
    setMovesMemoria(0);
    setMatchesMemoria(0);
    setTimeMemoria(0);
    setGameStartedMemoria(false);
    setGameWonMemoria(false);
    setScoreMemoria(0);
  };

  const handleCardClick = (index: number) => {
    if (!gameStartedMemoria) setGameStartedMemoria(true);
    
    const card = cardsMemoria[index];
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || card.matched) {
      return;
    }

    const newCards = [...cardsMemoria];
    newCards[index].flipped = true;
    setCardsMemoria(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setMovesMemoria(prev => prev + 1);
      
      const [firstIndex, secondIndex] = newFlippedIndices;
      if (newCards[firstIndex].emoji === newCards[secondIndex].emoji) {
        setTimeout(() => {
          setCardsMemoria(prevCards => {
            const updatedCards = [...prevCards];
            updatedCards[firstIndex].matched = true;
            updatedCards[secondIndex].matched = true;
            return updatedCards;
          });
          setMatchesMemoria(prev => prev + 1);
          setFlippedIndices([]);
        }, 600);
      } else {
        setTimeout(() => {
          setCardsMemoria(prevCards => {
             const updatedCards = [...prevCards];
             updatedCards[firstIndex].flipped = false;
             updatedCards[secondIndex].flipped = false;
             return updatedCards;
          });
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  // Funciones Secuencia
  const startSecuencia = () => {
    setSequence([]);
    setUserSequence([]);
    setLevelSecuencia(1);
    setScoreSecuencia(0);
    setGameOverSecuencia(false);
    setGameStartedSecuencia(true);
    nextLevel([]);
  };

  const nextLevel = (currentSeq: number[]) => {
    const newNum = Math.floor(Math.random() * 9) + 1;
    const newSequence = [...currentSeq, newNum];
    setSequence(newSequence);
    setUserSequence([]);
    setTimeout(() => showSequence(newSequence), 500);
  };

  const showSequence = async (seq: number[]) => {
    setDisplaySequence(true);
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => {
        setHighlightedNum(seq[i]);
        setTimeout(() => {
          setHighlightedNum(null);
          setTimeout(resolve, 200);
        }, 600);
      });
    }
    
    setDisplaySequence(false);
  };

  const handleNumberClick = (num: number) => {
    if (displaySequence || gameOverSecuencia) return;

    const newUserSeq = [...userSequence, num];
    setUserSequence(newUserSeq);

    setHighlightedNum(num);
    setTimeout(() => setHighlightedNum(null), 200);

    if (newUserSeq[newUserSeq.length - 1] !== sequence[newUserSeq.length - 1]) {
      endGameSecuencia();
    } else if (newUserSeq.length === sequence.length) {
      const newScore = scoreSecuencia + (levelSecuencia * 10);
      setScoreSecuencia(newScore);
      setLevelSecuencia(levelSecuencia + 1);
      setTimeout(() => nextLevel(sequence), 1000);
    }
  };

  const endGameSecuencia = () => {
    setGameOverSecuencia(true);
    if (scoreSecuencia > bestScoreSecuencia) {
      setBestScoreSecuencia(scoreSecuencia);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Inicializar juegos al cambiar
  useEffect(() => {
    if (juegoActivo === 'memoria') initializeMemoria();
    if (juegoActivo === 'secuencia') {
      setGameStartedSecuencia(false);
      setGameOverSecuencia(false);
    }
  }, [juegoActivo]);

  // MENÚ PRINCIPAL
  if (juegoActivo === 'menu') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #E0E7FF 0%, #F3E8FF 50%, #FCE7F3 100%)', padding: '1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4B5563', textDecoration: 'none' }}>
                <span style={{ fontSize: '1.5rem' }}>←</span>
                <span style={{ fontWeight: '500' }}>Volver</span>
              </Link>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }}>🧠</span>
                <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 'bold', margin: 0, background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  MenteActiva
                </h1>
              </div>
              
              <div style={{ width: '80px' }}></div>
            </div>
          </div>

          {/* Bienvenida */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', marginBottom: '2rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✨</div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', color: '#1F2937', margin: '0 0 1rem 0' }}>
              ¡Bienvenido a MenteActiva!
            </h2>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', color: '#4B5563', margin: 0 }}>
              Ejercita tu mente con estos juegos de memoria y agilidad mental
            </p>
          </div>

          {/* Grid de Juegos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', justifyContent: 'center' }}>
            <button
              onClick={() => setJuegoActivo('memoria')}
              style={{ background: 'white', borderRadius: '20px', padding: '2rem', border: '2px solid #F3F4F6', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎴</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1F2937', margin: '0 0 0.5rem 0' }}>Memoria de Parejas</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', margin: 0 }}>Encuentra las parejas de cartas</p>
            </button>

            <button
              onClick={() => setJuegoActivo('secuencia')}
              style={{ background: 'white', borderRadius: '20px', padding: '2rem', border: '2px solid #F3F4F6', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔢</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1F2937', margin: '0 0 0.5rem 0' }}>Secuencia Numérica</h3>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', margin: 0 }}>Memoriza números en orden</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // JUEGO MEMORIA DE PAREJAS
  if (juegoActivo === 'memoria') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #E9D5FF, #FCE7F3)', padding: '1rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <button onClick={() => setJuegoActivo('menu')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer', fontSize: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>←</span>
              <span>Volver</span>
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B5CF6', margin: 0 }}>🎴 Memoria de Parejas</h2>
            <button onClick={initializeMemoria} style={{ background: '#8B5CF6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}>
              🔄 Reiniciar
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>⏱️</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatTime(timeMemoria)}</div>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>🎯</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{movesMemoria}</div>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>⭐</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{matchesMemoria}/8</div>
            </div>
          </div>

          {/* Game Board */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {cardsMemoria.map((card: CardMemoria, index: number) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  disabled={card.matched}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '12px',
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: card.matched || card.flipped ? 'default' : 'pointer',
                    background: card.matched ? '#86EFAC' : card.flipped ? 'linear-gradient(135deg, #A78BFA, #F472B6)' : 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                    opacity: card.matched ? 0.5 : 1,
                    transition: 'all 0.3s',
                    transform: card.flipped ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {card.flipped || card.matched ? card.emoji : '❓'}
                </button>
              ))}
            </div>
          </div>

          {/* Victory Modal */}
          {gameWonMemoria && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
              <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>¡Felicitaciones!</h3>
                <p style={{ color: '#4B5563', marginBottom: '1.5rem' }}>Has completado el juego</p>
                <div style={{ background: 'linear-gradient(135deg, #E9D5FF, #FCE7F3)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆 {scoreMemoria}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                    <div>
                      <div style={{ color: '#4B5563' }}>Tiempo</div>
                      <div style={{ fontWeight: 'bold' }}>{formatTime(timeMemoria)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#4B5563' }}>Movimientos</div>
                      <div style={{ fontWeight: 'bold' }}>{movesMemoria}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={initializeMemoria} style={{ flex: 1, background: '#8B5CF6', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Jugar de nuevo
                  </button>
                  <button onClick={() => setJuegoActivo('menu')} style={{ flex: 1, background: '#E5E7EB', color: '#1F2937', border: 'none', padding: '0.75rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Menú principal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // JUEGO SECUENCIA NUMÉRICA
  if (juegoActivo === 'secuencia') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #DBEAFE, #E0F2FE)', padding: '1rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <button onClick={() => setJuegoActivo('menu')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer', fontSize: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>←</span>
              <span>Volver</span>
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3B82F6', margin: 0 }}>🔢 Secuencia Numérica</h2>
            <button onClick={startSecuencia} style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}>
              🔄 Reiniciar
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>📈</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{levelSecuencia}</div>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>⚡</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{scoreSecuencia}</div>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>🏆</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{bestScoreSecuencia}</div>
            </div>
          </div>

          {/* Game Board */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '2rem' }}>
            {!gameStartedSecuencia ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🧠</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>¿Listo para ejercitar tu memoria?</h3>
                <p style={{ color: '#4B5563', marginBottom: '2rem' }}>Memoriza la secuencia de números y repítela</p>
                <button onClick={startSecuencia} style={{ background: 'linear-gradient(90deg, #3B82F6, #06B6D4)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '16px', fontSize: '1.25rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  ¡Comenzar!
                </button>
              </div>
            ) : (
              <>
                {/* Sequence Display */}
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                  {displaySequence ? (
                    <>
                      <p style={{ color: '#3B82F6', fontWeight: 'bold', marginBottom: '1rem' }}>Memoriza esta secuencia...</p>
                      <div style={{ fontSize: '3rem', fontWeight: 'bold', minHeight: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* No mostramos la secuencia aquí, solo el número brillando */}
                      </div>
                    </>
                  ) : (
                    <>
                      <p style={{ color: '#10B981', fontWeight: 'bold', marginBottom: '1rem' }}>¡Ahora repite la secuencia!</p>
                      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', minHeight: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {userSequence.length > 0 ? userSequence.join(' - ') : 'Toca los números en orden...'}
                      </div>
                    </>
                  )}
                </div>

                {/* Number Pad */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num: number) => (
                    <button
                      key={num}
                      onClick={() => handleNumberClick(num)}
                      disabled={displaySequence || gameOverSecuencia}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '12px',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: displaySequence || gameOverSecuencia ? 'default' : 'pointer',
                        background: highlightedNum === num ? 'linear-gradient(135deg, #60A5FA, #22D3EE)' : 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                        color: 'white',
                        opacity: displaySequence || gameOverSecuencia ? 0.5 : 1,
                        transition: 'all 0.2s',
                        transform: highlightedNum === num ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Game Over Modal */}
          {gameOverSecuencia && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
              <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😔</div>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>¡Fin del juego!</h3>
                <p style={{ color: '#4B5563', marginBottom: '1.5rem' }}>Llegaste al nivel {levelSecuencia}</p>
                <div style={{ background: 'linear-gradient(135deg, #DBEAFE, #E0F2FE)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <div style={{ color: '#3B82F6', fontWeight: 'bold', marginBottom: '0.25rem' }}>Tu Puntaje</div>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{scoreSecuencia}</div>
                    </div>
                    <div>
                      <div style={{ color: '#F59E0B', fontWeight: 'bold', marginBottom: '0.25rem' }}>Mejor Puntaje</div>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{bestScoreSecuencia}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={startSecuencia} style={{ flex: 1, background: '#3B82F6', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Jugar de nuevo
                  </button>
                  <button onClick={() => setJuegoActivo('menu')} style={{ flex: 1, background: '#E5E7EB', color: '#1F2937', border: 'none', padding: '0.75rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Menú principal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}