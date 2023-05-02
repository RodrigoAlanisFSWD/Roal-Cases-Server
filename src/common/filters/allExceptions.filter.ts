import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    constructor(private httpAdapterHost: HttpAdapterHost) {}

    catch(exception: any, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();

        const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

        this.logger.error(
            `Exception: ${exception.message}, stack: ${exception.stack}`
        )

        const body = {
            status: httpStatus,
            msg: 'Internal Server Error'
        }

        httpAdapter.reply(ctx.getResponse(), body, httpStatus)
    }
}