import { Catch, HttpException, Logger, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name)

    // constructor(private configService: ConfigService) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus()

        this.logger.error(`Exception: ${exception.message}, status: ${status}`)

        response.status(status).json({
            statusCode: status,
            msg: exception.message
        })
    }
}