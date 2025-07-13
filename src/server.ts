import { fastifyCors } from '@fastify/cors';
import { fastifyMultipart } from '@fastify/multipart';
import { fastify } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { env } from './env.ts';
import { createQuestionRoute } from './routes/create-question.ts';
import { createRoomsRoute } from './routes/create-room.ts';
import { getQuestionsRoute } from './routes/get-questions.ts';
import { getRoomsRoute } from './routes/get-rooms.ts';
import { audioUploadRoute } from './routes/upload-audio.ts';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: '*',
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.register(fastifyMultipart);

app.get('/health', () => {
  return 'ok';
});

app.register(getRoomsRoute);
app.register(createRoomsRoute);

app.register(getQuestionsRoute);
app.register(createQuestionRoute);
app.register(audioUploadRoute);

app.listen({ port: env.PORT }).then();
