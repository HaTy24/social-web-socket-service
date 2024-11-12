import { Inject, Injectable, Logger } from '@nestjs/common';
import { AuditService } from 'mvc-common-toolkit';

import { INJECTION_TOKEN } from '@shared/constants';

import { WebsocketManagerService } from './websocket-manager.service';

@Injectable()
export class WebsocketService {
  protected logger = new Logger(WebsocketService.name);

  constructor(
    protected wsManagerService: WebsocketManagerService,

    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected auditService: AuditService,
  ) {}
}
