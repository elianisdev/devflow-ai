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
    title: "Tablero de {name}",
    path: "tablero",
    summaryLabel: "Resumen del tablero",
    userMenuLabel: "Menú de usuario",
    newTask: "Nueva tarea",
    createFirst: "+ Crear la primera",
    noPullRequest: "Sin PR",
    stationEmpty: "Sin tareas",
    taskCount: (count: number) => (count === 1 ? "1 tarea" : `${count} tareas`),
    doneCount: (count: number) => `${count} en hecho`,
    columns: {
      TODO: {
        title: "Por hacer",
        emptyTitle: "Todo empieza con una tarea",
        emptyText: "Escribe lo que vas a construir. Más adelante la conectas con su PR.",
      },
      IN_PROGRESS: {
        title: "En progreso",
        emptyTitle: "Nada en marcha todavía",
        emptyText: "Cuando empieces una tarea, muévela a esta estación para que se vea en qué estás.",
      },
      IN_REVIEW: {
        title: "En revisión",
        emptyTitle: "Nadie espera tu revisión",
        emptyText: "Cuando abras un PR, su tarea para en esta estación hasta que lo aprueben.",
      },
      DONE: {
        title: "Hecho",
        emptyTitle: "Aún no hay merges",
        emptyText: "El primero siempre es el que más cuesta.",
      },
    },
  },
  taskForm: {
    createTitle: "Nueva tarea",
    createDescription: "Aparece en Por hacer. Puedes conectarla con su PR más adelante.",
    detailTitle: "Detalle de la tarea",
    close: "Cerrar",
    title: "Título",
    description: "Descripción (opcional)",
    descriptionPlaceholder: "Qué hay que hacer y cómo sabes que quedó listo.",
    cancel: "Cancelar",
    create: "Crear tarea",
    creating: "Creando…",
    save: "Guardar cambios",
    saving: "Guardando…",
    errors: {
      titleRequired: "Escribe un título para la tarea.",
      titleTooLong: "Usa 120 caracteres o menos.",
    },
  },
  deleteTask: {
    open: "Eliminar tarea",
    title: "¿Eliminar esta tarea?",
    description: "«{title}» se borra del tablero y no se puede recuperar.",
    keep: "Conservarla",
    confirm: "Sí, eliminar",
    pending: "Eliminando…",
  },
  prStates: {
    draft: "Borrador",
    open: "Abierto",
    merged: "Mergeado",
    closed: "Cerrado",
  },
};
