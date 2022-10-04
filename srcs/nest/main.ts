import { NestFactory } from '@nestjs/core';
import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);

	app.useStaticAssets({
		root: join(__dirname, '..', '..', 'srcs', 'public'),
		prefix: '/public/',
	});
	app.useStaticAssets({
		root: join(__dirname, '..', 'styles'),
		prefix: '/styles/',
		decorateReply: false,
	});
	app.setViewEngine({
		engine: {
			eta: require('eta'),
		},
		templates: join(__dirname, '..', '..', 'srcs', 'views'),
	});

	//await app.listen(3000);
	await app.listen(3000, '0.0.0.0');
}
bootstrap();
