import { HttpStatus } from '@nestjs/common';
import { HttpResponse, OperationResult } from 'mvc-common-toolkit';

export function wrapFailedOperationResult(
  data: OperationResult,
  defaultHttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
): HttpResponse {
  return {
    ...data,
    httpCode: data.httpCode || defaultHttpStatus,
  };
}
