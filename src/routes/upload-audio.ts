import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod/v4';
import { db } from '../db/connection.ts';
import { schema } from '../db/schema/index.ts';
import {
  generateEmbeddings,
  trancribeAudio,
} from '../services/genai.service.ts';

export const audioUploadRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/audio',
    {
      schema: {
        params: z.object({
          roomId: z.string().min(3),
        }),
      },
    },
    async (request, replay) => {
      const audio = await request.file();
      const { roomId } = request.params;
      if (!audio) {
        throw new Error('Audio not found');
      }
      const audioBuffer = await audio.toBuffer();
      const audioBase64 = await audioBuffer.toString('base64');
      const transcription = await trancribeAudio(audioBase64, audio.mimetype);
      const embeddings = await generateEmbeddings(transcription);
      console.log(embeddings);

      const response = await db
        .insert(schema.audioChunks)
        .values({
          roomId,
          transcription,
          embeddings,
        })
        .returning();

      if (!response.length) {
        throw new Error('Ocorreu um erro ao salvar os embeddings');
      }
      //   return replay.status(201).send({ roomId: result[0].id });
      return replay.status(201).send({ chunkId: response[0].id });
    }
  );
};
