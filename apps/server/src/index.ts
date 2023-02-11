export { appRouter, type AppRouter } from "./root";
export { createTRPCContext } from "./trpc";
import superjson from 'superjson';

export const transformer = superjson;