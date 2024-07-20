import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JWT, X_API_KEY } from 'src/common/constants';

export function AuthAndController(
  guard: any,
  controller: string,
  useGuard: boolean,
) {
  const tag = controller.charAt(0).toUpperCase() + controller.slice(1);
  return applyDecorators(
    useGuard ? UseGuards(guard) : UseGuards(),
    ApiTags(tag),
    useGuard ? ApiBearerAuth(JWT) : ApiBearerAuth(),
    Controller(controller),
    ApiBearerAuth(X_API_KEY),
  );
}
