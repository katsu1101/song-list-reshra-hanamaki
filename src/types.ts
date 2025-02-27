import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type Song = Awaited<ReturnType<typeof prisma.song.findFirst>>;

export type SongsList = Awaited<ReturnType<typeof prisma.song.findMany>>;
