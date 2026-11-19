import type { Dictionary } from "@/types/dictionary";

export const es: Dictionary = {
  metadata: {
    title: "DevFlow AI",
    description:
      "Un tablero de tareas para equipos de desarrollo donde cada tarea se conecta con su pull request de GitHub.",
  },
  home: {
    status: "devflow-ai · v0.1 en construcción",
    title: "Cada tarea, conectada con su pull request.",
    description:
      "DevFlow AI es un tablero de tareas para equipos de desarrollo. Cada tarjeta muestra el estado real de su pull request en GitHub, así nadie tiene que cambiar de herramienta para saber qué está en revisión o ya se mergeó.",
    prStatesTitle: "Estados del pull request",
  },
  prStates: {
    draft: "Borrador",
    open: "Abierto",
    merged: "Mergeado",
    closed: "Cerrado",
  },
};
