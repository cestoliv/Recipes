import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}
	getAuthor(): string {
		return 'cestoliv <me@cestoliv.com>';
	}
}
