import { demoPullRequests, type DemoTask } from "./demo-task";

export const es: DemoTask[] = [
  {
    title: "Modo demo",
    description: "Un tablero de ejemplo sin login que nunca escribe en la base de datos.",
    status: "TODO",
    pullRequest: null,
  },
  { title: "Test E2E y release v0.1", description: null, status: "TODO", pullRequest: null },
  {
    title: "Vincular tareas con PRs",
    description: "Pegar la URL del PR y ver su estado en la tarjeta.",
    status: "IN_PROGRESS",
    pullRequest: demoPullRequests.linkPullRequests,
  },
  { title: "Fijar Node 24 en Vercel", description: null, status: "IN_PROGRESS", pullRequest: demoPullRequests.pinNode },
  {
    title: "Arrastrar y soltar accesible",
    description: "Mouse, dedo y teclado, con anuncios para lector de pantalla.",
    status: "IN_REVIEW",
    pullRequest: demoPullRequests.dragAndDrop,
  },
  { title: "Tablero con columnas fijas", description: null, status: "DONE", pullRequest: demoPullRequests.board },
  { title: "Iniciar sesión con GitHub", description: null, status: "DONE", pullRequest: demoPullRequests.signIn },
];
