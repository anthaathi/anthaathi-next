import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { DnsInstrumentation } from '@opentelemetry/instrumentation-dns';

const otlpTraceExporter = new OTLPTraceExporter();

const sdk = new NodeSDK({
  traceExporter: otlpTraceExporter,
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'graphql-engine',
  }),
  instrumentations: [
    new PrismaInstrumentation(),
    new GraphQLInstrumentation(),
    new HttpInstrumentation(),
    new DnsInstrumentation(),
  ],
});

sdk.start();

process.on('SIGINT', async () => {
  try {
    await sdk.shutdown();
    console.log('Tracing finished.');
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
});
