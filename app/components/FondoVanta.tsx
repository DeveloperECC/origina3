// app/components/FondoVanta.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';

const FondoVanta = () => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      // @ts-ignore
      setVantaEffect(NET({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x3f8eff,      // Color de los puntos y líneas
        backgroundColor: 0xffffff, // Color del fondo (blanco)
        points: 10.00,           // Cantidad de puntos
        maxDistance: 23.00,
        spacing: 18.00
      }));
    }
    
    // Limpieza al desmontar el componente
    return () => {
      // @ts-ignore
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1 // Lo pone detrás de todo el contenido
    }} />
  );
};

export default FondoVanta;