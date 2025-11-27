import { useState, useEffect, useCallback } from 'react';

export type Goal = {
  id: string;
  text: string;
  createdAt: number;
  // Podrías añadir status, etc. aquí si lo necesitas después
};

const LS_KEY = 'violetta-goals';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  // --- NUEVA BANDERA ---
  const [isLoaded, setIsLoaded] = useState(false); // Para saber si ya cargamos desde localStorage

  // Cargar al inicio
  useEffect(() => {
    console.log('[useGoals] Attempting to load goals...');
    try {
      const raw = localStorage.getItem(LS_KEY);
      console.log('[useGoals] Raw data from localStorage:', raw);
      const items = raw ? JSON.parse(raw) : [];
      if (Array.isArray(items)) {
        setGoals(items);
        console.log('[useGoals] Goals loaded successfully:', items);
      } else {
         console.warn('[useGoals] Parsed data is not an array, setting empty goals.');
         setGoals([]);
      }
    } catch (error){
      console.error("[useGoals] Error loading goals from localStorage:", error);
      setGoals([]);
    } finally {
      // --- MARCAR COMO CARGADO ---
      // Marcamos como cargado independientemente de si hubo éxito o error
      setIsLoaded(true); 
      console.log('[useGoals] Loading finished.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []); // Dependencia vacía para que se ejecute solo una vez al montar

  // Guardar cuando cambian las metas (SOLO SI YA SE CARGÓ)
  useEffect(() => {
    // --- USAR LA BANDERA ---
    // Si aún no hemos cargado los datos iniciales, no hacemos nada.
    if (!isLoaded) {
      console.log('[useGoals] Not loaded yet, skipping save.');
      return; 
    }

    try {
      console.log('[useGoals] Attempting to save goals:', goals);
      const dataToSave = JSON.stringify(goals);
      localStorage.setItem(LS_KEY, dataToSave);
      console.log('[useGoals] Goals saved successfully.');
    } catch (error) {
      console.error("[useGoals] Error saving goals to localStorage:", error);
      alert("Error al guardar las metas. Es posible que el almacenamiento esté lleno.");
    }
    // La dependencia ahora incluye isLoaded
  }, [goals, isLoaded]); 

  const addGoal = useCallback((text: string) => {
    if (!text.trim()) return;
    const newGoal: Goal = {
      id: `g-${Date.now()}`,
      text: text.trim(),
      createdAt: Date.now(),
    };
    console.log('[useGoals] Adding goal:', newGoal);
    setGoals(prev => [...prev, newGoal]);
  }, []);

  const removeGoal = useCallback((id: string) => {
    console.log('[useGoals] Removing goal with id:', id);
    setGoals(prev => prev.filter(goal => goal.id !== id));
  }, []);

  return { goals, addGoal, removeGoal };
}