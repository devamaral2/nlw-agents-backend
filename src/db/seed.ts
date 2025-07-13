import { reset, seed } from 'drizzle-seed';
import { db, sql } from './connection.ts';
import { schema } from './schema/index.ts';

await reset(db, { schema });

await seed(db, schema).refine((f) => {
  return {
    rooms: {
      count: 5,
      columns: {
        name: f.companyName(),
        description: f.loremIpsum(),
        createdAt: f.datetime(),
      },
    },
    questions: {
      count: 20,
    },
    audioChunks: {
      count: 1,
    },
  };
});

await sql.end();

// biome-ignore lint/suspicious/noConsole: for dev tests
console.log('Database seeded');
