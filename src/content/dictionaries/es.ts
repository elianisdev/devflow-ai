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
  auth: {
    signIn: "Continuar con GitHub",
    signingIn: "Redirigiendo a GitHub…",
    signOut: "Cerrar sesión",
    signInCancelled: "Cancelaste el inicio de sesión en GitHub. Puedes intentarlo de nuevo cuando quieras.",
    signInFailed: "No pudimos iniciar tu sesión con GitHub. Inténtalo de nuevo.",
  },
  board: {
    title: "Tu tablero",
    comingSoon: "Aquí van a aparecer tus tareas muy pronto.",
    userMenuLabel: "Menú de usuario",
  },
  prStates: {
    draft: "Borrador",
    open: "Abierto",
    merged: "Mergeado",
    closed: "Cerrado",
  },
};
