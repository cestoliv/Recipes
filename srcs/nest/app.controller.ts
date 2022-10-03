import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@Render('index')
	getIndex() {
		return { hello: this.appService.getHello() };
	}

	@Get('author')
	getAuthor(): string {
		return this.appService.getAuthor();
	}
}
